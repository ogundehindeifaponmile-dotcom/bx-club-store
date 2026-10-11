const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('❌ CRITICAL: STRIPE_WEBHOOK_SECRET is missing in Vercel!');
      return res.status(200).json({ received: true });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
      console.log('✅ Webhook signature verified for event:', event.type);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const txRef = session.metadata?.txRef;
      console.log('💳 Checkout completed for txRef:', txRef);

      const url = process.env.KV_REST_API_URL;
      const token = process.env.KV_REST_API_TOKEN;

      if (url && token && txRef) {
        try {
          const fetchRes = await fetch(`${url}/lrange/bx_orders/0/-1`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (!fetchRes.ok) {
            throw new Error(`Failed to fetch orders: ${fetchRes.status}`);
          }
          
          const data = await fetchRes.json();
          let orders = (data.result || []).map(o => {
            try { return JSON.parse(o); } catch (e) { return null; }
          }).filter(Boolean);

          const orderIndex = orders.findIndex(o => o.txRef === txRef);
          if (orderIndex !== -1) {
            console.log('✅ Found order. Updating status to PAID.');
            orders[orderIndex].status = 'paid';
            orders[orderIndex].verifiedAt = new Date().toISOString();
            
            await fetch(`${url}/del/bx_orders`, { 
              method: 'POST', 
              headers: { Authorization: `Bearer ${token}` } 
            });
            
            const stringifiedOrders = orders.reverse().map(o => JSON.stringify(o));
            const pushRes = await fetch(`${url}/lpush/bx_orders`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(stringifiedOrders)
            });
            
            if (!pushRes.ok) {
              throw new Error(`Failed to save orders: ${pushRes.status}`);
            }
            console.log('✅ Orders successfully updated in Upstash');
          } else {
            console.warn('⚠️ Order txRef not found in database:', txRef);
          }
        } catch (dbError) {
          console.error('❌ Database update failed:', dbError);
        }
      }

      try {
        const customerName = session.metadata?.customerName || 'Customer';
        const currencySymbol = session.currency === 'gbp' ? '£' : '₦';
        const amountFormatted = (session.amount_total / 100).toLocaleString();
        
        await resend.emails.send({
          from: 'BX CLUB <orders@mg.bxclubhq.com>',
          to: [session.customer_email], 
          subject: `✅ Order Confirmed — #${txRef}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 8px; text-align: center;">
              <h1 style="color: #FFD700; margin-top: 0;">Thank You, ${customerName.split(' ')[0]}!</h1>
              <p style="color: #888;">Your order #${txRef} has been received and is being prepared.</p>
              <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p style="color: #FFD700; font-size: 24px; font-weight: bold; margin: 0;">${currencySymbol}${amountFormatted}</p>
              </div>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">BX CLUB | Blackxcellencee</p>
            </div>
          `,
        });
        console.log('📧 Receipt email sent successfully to:', session.customer_email);
      } catch (emailError) {
        console.error('❌ Email failed:', emailError);
      }
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('❌ Webhook handler crashed:', error);
    res.status(200).json({ received: true });
  }
}
