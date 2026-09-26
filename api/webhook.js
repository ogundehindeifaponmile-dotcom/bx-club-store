const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const txRef = session.metadata?.txRef;

    // Update order status to 'paid' in Upstash
    const fetchRes = await fetch(`${process.env.STORAGE_URL}/lrange/bx_orders/0/-1`, {
      headers: { Authorization: `Bearer ${process.env.STORAGE_TOKEN}` }
    });
    const data = await fetchRes.json();
    let orders = (data.result || []).map(o => JSON.parse(o));
    
    const orderIndex = orders.findIndex(o => o.txRef === txRef);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'paid';
      orders[orderIndex].verifiedAt = new Date().toISOString();
      
      await fetch(`${process.env.STORAGE_URL}/del/bx_orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.STORAGE_TOKEN}` }
      });
      if (orders.length > 0) {
        await fetch(`${process.env.STORAGE_URL}/lpush/bx_orders`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.STORAGE_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(orders.map(o => JSON.stringify(o)))
        });
      }
    }

    // Send Customer Receipt Email
    const customerName = session.metadata?.customerName || 'Customer';
    const currencySymbol = session.currency === 'gbp' ? '£' : '₦';
    
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
          <p style="color: #666; font-size: 12px; margin-top: 30px;">BX CLUB | Blackxcellencee</p>
        </div>
      `,
    });
  }

  res.status(200).json({ received: true });
}
