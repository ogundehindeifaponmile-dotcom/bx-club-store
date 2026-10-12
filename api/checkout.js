const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');

// Initialize Resend safely
let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

module.exports = async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    console.log('✅ Checkout API called. Body type:', typeof req.body);
    
    // Safely parse body if Vercel passes it as a string
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } 
      catch (e) { return res.status(400).json({ error: 'Invalid JSON in request body' }); }
    }

    const { items, customer, amount, currency, txRef } = body;

    if (!items || !customer || !amount || !currency || !txRef) {
      console.error('❌ Missing required fields:', { items: !!items, customer: !!customer, amount, currency, txRef });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is missing in Vercel Environment Variables!');
      return res.status(500).json({ error: 'Server configuration error: Missing Stripe Key' });
    }

    const stripeCurrency = currency === 'GBP' ? 'gbp' : 'ngn';

    const lineItems = items.map(item => {
      const price = Math.round((item.price || 0) * 100);
      return {
        price_data: {
          currency: stripeCurrency,
          product_data: { name: item.shortName || item.name || 'Product', images: item.image ? [item.image] : [] },
          unit_amount: price,
        },
        quantity: item.quantity || 1,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    const shippingAmount = amount - subtotal;
    
    if (shippingAmount > 0) {
      lineItems.push({
        price_data: { currency: stripeCurrency, product_data: { name: 'Shipping' }, unit_amount: Math.round(shippingAmount * 100) },
        quantity: 1,
      });
    }

    console.log('💳 Creating Stripe session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      metadata: { 
        txRef, 
        customerName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
        amount: amount.toString(),
        currency: currency
      },
      success_url: `${req.headers.origin || 'https://bxclubhq.com'}?success=true&order=${txRef}`,
      cancel_url: `${req.headers.origin || 'https://bxclubhq.com'}?canceled=true`,
    });
    console.log('✅ Stripe session created:', session.id);

    // Save to KV (Safely wrapped so it doesn't crash the checkout if it fails)
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
        console.log('✅ Saved to Upstash KV');
      } catch (kvError) {
        console.error('❌ Failed to save to Upstash KV:', kvError.message);
      }
    }

    // Send Admin Email (Safely wrapped)
    if (resend) {
      try {
        const currencySymbol = currency === 'GBP' ? '£' : '₦';
        const itemsList = items.map(item => `<li>${item.shortName || item.name} × ${item.quantity || 1} — ${currencySymbol}${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</li>`).join('');
        await resend.emails.send({
          from: 'BX CLUB <onboarding@resend.dev>',
          to: ['bxclubhq@gmail.com'],
          replyTo: customer.email,
          subject: `🛍️ New Order Received — ${txRef}`,
          html: `<h1>New Order: ${txRef}</h1><p>Total: ${currencySymbol}${amount}</p><ul>${itemsList}</ul>`,
        });
        console.log('✅ Admin email sent');
      } catch (emailError) {
        console.error('❌ Failed to send admin email:', emailError.message);
      }
    }

    // CRITICAL: Always return valid JSON
    return res.status(200).json({ url: session.url });
    
  } catch (error) {
    console.error('❌ Checkout API CRASHED:', error.message);
    // CRITICAL: Return JSON even on crash to prevent frontend "Unexpected token" errors
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

module.exports.config = {
  api: { bodyParser: true }
};
