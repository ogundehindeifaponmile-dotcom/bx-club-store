const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');

let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('❌ CRITICAL: STRIPE_WEBHOOK_SECRET is missing!');
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
          const fetchRes = await fetch(`${url}/lrange/bx_orders/0/-1`, { headers: { Authorization: `Bearer ${token}` } });
          if (!fetchRes.ok) throw new Error(`Failed to fetch: ${fetchRes.status}`);
          
          const data = await fetchRes.json();
          let orders = (data.result || []).map(o => {
            try { return JSON.parse(o); } catch (e) { return null; }
          }).filter(Boolean);

          const orderIndex = orders.findIndex(o => o.txRef === txRef);
          if (orderIndex !== -1) {
            console.log('✅ Found order. Updating status to PAID.');
            orders[orderIndex].status = 'paid';
            orders[orderIndex].verifiedAt = new Date().toISOString();
            
            await fetch(`${url}/del/bx_orders`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
            
            const stringifiedOrders = orders.reverse().map(o => JSON.stringify(o));
            const pushRes = await fetch(`${url}/lpush/bx_orders`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(stringifiedOrders)
            });
            
            if (!pushRes.ok) throw new Error(`Failed to push: ${pushRes.status}`);
            console.log('✅ Orders successfully updated in Upstash');
          }
        } catch (dbError) {
          console.error('❌ Database update failed:', dbError.message);
        }
      }

      if (resend && session.customer_email) {
        try {
          const customerName = session.metadata?.customerName || 'Customer';
          const currencySymbol = session.currency === 'gbp' ? '£' : '₦';
          const amountFormatted = ((session.amount_total || 0) / 100).toLocaleString();
          
          await resend.emails.send({
            from: 'BX CLUB <orders@mg.bxclubhq.com>',
            to: [session.customer_email], 
            subject: `✅ Order Confirmed — #${txRef}`,
            html: `<h1 style="color:#FFD700">Thank You!</h1><p>Order #${txRef} confirmed.</p><p>Total: ${currencySymbol}${amountFormatted}</p>`,
          });
          console.log('📧 Receipt email sent');
        } catch (emailError) {
          console.error('❌ Email failed:', emailError.message);
        }
      }
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('❌ Webhook handler crashed:', error.message);
    return res.status(200).json({ received: true }); // Always return 200 to Stripe
  }
}

handler.config = { api: { bodyParser: false } };
module.exports = handler;
