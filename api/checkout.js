const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  console.log('🚀 API /api/checkout HIT! Method:', req.method); // Proof of life

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ MISSING STRIPE KEY IN VERCEL');
      return res.status(500).json({ error: 'Server configuration error: Missing Stripe Key' });
    }

    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    
    // Safely parse body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { items, customer, amount, currency, txRef } = body;

    if (!items || !customer || !amount || !currency || !txRef) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const stripeCurrency = currency === 'GBP' ? 'gbp' : 'ngn';

    const lineItems = items.map(item => ({
      price_data: {
        currency: stripeCurrency,
        product_data: { name: item.shortName || item.name || 'Product', images: item.image ? [item.image] : [] },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    const shippingAmount = amount - subtotal;
    
    if (shippingAmount > 0) {
      lineItems.push({
        price_data: { currency: stripeCurrency, product_data: { name: 'Shipping' }, unit_amount: Math.round(shippingAmount * 100) },
        quantity: 1,
      });
    }

    console.log('💳 Creating Stripe session for:', txRef);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      metadata: { txRef, customerName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(), amount: amount.toString(), currency },
      success_url: `${req.headers.origin || 'https://bxclubhq.com'}?success=true&order=${txRef}`,
      cancel_url: `${req.headers.origin || 'https://bxclubhq.com'}?canceled=true`,
    });

    console.log('✅ Stripe session created successfully:', session.id);

    // Save to KV (Non-blocking, won't crash checkout if it fails)
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;
    if (kvUrl && kvToken) {
      try {
        const orderData = { txRef, items, customer, amount, currency, status: 'pending', timestamp: new Date().toISOString() };
        await fetch(`${kvUrl}/lpush/bx_orders`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify([JSON.stringify(orderData)])
        });
      } catch (e) { console.error('KV Save Error:', e.message); }
    }

    // Send Admin Email (Non-blocking)
    if (resend) {
      try {
        const sym = currency === 'GBP' ? '£' : '₦';
        await resend.emails.send({
          from: 'BX CLUB <onboarding@resend.dev>',
          to: ['bxclubhq@gmail.com'],
          replyTo: customer.email,
          subject: `🛍️ New Order Received — ${txRef}`,
          html: `<h1>New Order: ${txRef}</h1><p>Total: ${sym}${amount}</p>`,
        });
      } catch (e) { console.error('Email Error:', e.message); }
    }

    // SUCCESS: Return the URL to the frontend
    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('❌ CRITICAL API CRASH:', error.message);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

module.exports.config = { api: { bodyParser: true } };
