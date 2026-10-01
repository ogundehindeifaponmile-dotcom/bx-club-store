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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('🔔 Webhook received. Headers:', req.headers);

  if (!webhookSecret) {
    console.error('❌ CRITICAL: STRIPE_WEBHOOK_SECRET is missing in Vercel Environment Variables!');
    return res.status(500).json({ error: 'Webhook secret missing' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log('✅ Webhook signature verified successfully.');
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const txRef = session.metadata?.txRef;
    console.log('💳 Checkout completed for session:', session.id, 'txRef:', txRef);

    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      console.error('❌ CRITICAL: Upstash KV environment variables are missing!');
      return res.status(200).json({ received: true }); // Return 200 so Stripe doesn't keep retrying
    }

    try {
      // 1. Fetch all orders
      console.log('📥 Fetching orders from Upstash...');
      const fetchRes = await fetch(`${url}/lrange/bx_orders/0/-1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await fetchRes.json();
      console.log('📦 Upstash raw response:', data);

      let orders = (data.result || []).map(o => {
        try { return JSON.parse(o); } catch (e) { return null; }
      }).filter(Boolean);

      // 2. Find and update the specific order
      const orderIndex = orders.findIndex(o => o.txRef === txRef);
      
      if (orderIndex !== -1) {
        console.log('✅ Found order in database. Updating status to "paid"...');
        orders[orderIndex].status = 'paid';
        orders[orderIndex].verifiedAt = new Date().toISOString();
        
        // 3. Delete old list and save updated list
        await fetch(`${url}/del/bx_orders`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const pushRes = await fetch(`${url}/lpush/bx_orders`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(orders.map(o => JSON.stringify(o)))
        });
        console.log('💾 Upstash update response:', await pushRes.json());
      } else {
        console.warn('⚠️ Order txRef not found in database:', txRef);
      }

      // 4. Send Customer Receipt Email
      const customerName = session.metadata?.customerName || 'Customer';
      const currencySymbol = session.currency === 'gbp' ? '£' : '₦';
      
      console.log('📧 Sending receipt email to:', session.customer_email);
      await resend.emails.send({
        from: 'BX CLUB <onboarding@resend.dev>',
        to: [session.customer_email],
        subject: `✅ Order Confirmed — #${txRef}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 8px; text-align: center;">
            <h1 style="color: #FFD700;">Thank You, ${customerName.split(' ')[0]}!</h1>
            <p style="color: #888;">Your order #${txRef} has been received and is being prepared.</p>
            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <p style="color: #FFD700; font-size: 24px; font-weight: bold; margin: 0;">${currencySymbol}${(session.amount_total / 100).toLocaleString()}</p>
            </div>
          </div>
        `,
      });
      console.log('✅ Receipt email sent successfully.');

    } catch (dbError) {
      console.error('❌ Database update failed in webhook:', dbError);
    }
  }

  // Always return 200 to Stripe so they know we received it
  res.status(200).json({ received: true });
}
