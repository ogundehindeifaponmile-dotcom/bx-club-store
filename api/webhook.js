const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// CRITICAL: Stripe requires the raw body to verify the signature.
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
      return res.status(200).json({ received: true }); // Return 200 to stop Stripe retries
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
          // 1. Fetch all orders
          const fetchRes = await fetch(`${url}/lrange/bx_orders/0/-1`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await fetchRes.json();
          let orders = (data.result || []).map(o => {
            try { return JSON.parse(o); } catch (e) { return null; }
          }).filter(Boolean);

          // 2. Find and update the specific order
          const orderIndex = orders.findIndex(o => o.txRef === txRef);
          if (orderIndex !== -1) {
            console.log('✅ Found order. Updating status to PAID.');
            orders[orderIndex].status = 'paid';
            orders[orderIndex].verifiedAt = new Date().toISOString();
            
            // 3. Save back to database
            await fetch(`${url}/del/bx_orders`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
            await fetch(`${url}/lpush/bx_orders`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(orders.map(o => JSON.stringify(o)))
            });
          } else {
            console.warn('⚠️ Order txRef not found in database:', txRef);
          }
        } catch (dbError) {
          console.error('❌ Database update failed:', dbError);
        }
      }

      // 4. Send Customer Receipt Email
      try {
        const customerName = session.metadata?.customerName || 'Customer';
        const currencySymbol = session.currency === 'gbp' ? '£' : '₦';
        
        await resend.emails.send({
          from: 'BX CLUB <orders@mg.bxclubhq.com>', // ✅ Uses your newly verified domain!
          to: [session.customer_email], // ✅ Sends directly to the customer
          subject: `✅ Order Confirmed — #${txRef}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 8px; text-align: center;">
              <h1 style="color: #FFD700;">Thank You, ${customerName.split(' ')[0]}!</h1>
              <p style="color: #888;">Your order #${txRef} has been received and is being prepared.</p>
              <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p style="color: #FFD700; font-size: 24px; font-weight: bold; margin: 0;">${currencySymbol}${(session.amount_total / 100).toLocaleString()}</p>
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

    // ALWAYS return 200 to Stripe so they stop retrying
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('❌ Webhook handler crashed:', error);
    res.status(200).json({ received: true }); // Still return 200 to stop Stripe emails
  }
}
