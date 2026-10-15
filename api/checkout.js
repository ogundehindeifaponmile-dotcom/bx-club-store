const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  console.log('🚀 [CHECKOUT API] Hit! Method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ [CHECKOUT API] MISSING STRIPE KEY IN VERCEL');
      return res.status(500).json({ error: 'Server config error: Missing Stripe Key' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log('📦 [CHECKOUT API] Body received, txRef:', body.txRef);

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

    console.log('💳 [CHECKOUT API] Creating Stripe session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      metadata: { txRef, amount: amount.toString(), currency },
      success_url: `${req.headers.origin || 'https://bxclubhq.com'}?success=true&order=${txRef}`,
      cancel_url: `${req.headers.origin || 'https://bxclubhq.com'}?canceled=true`,
    });

    console.log('✅ [CHECKOUT API] Success! Session URL:', session.url);
    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('❌ [CHECKOUT API] CRASH:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

module.exports.config = {
  api: { bodyParser: true }
};
