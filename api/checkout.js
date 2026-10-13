const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. SAFELY CHECK FOR STRIPE KEY (This prevents the crash!)
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Server Error: STRIPE_SECRET_KEY is missing in Vercel Environment Variables.' });
    }
    
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

    // 2. Parse Body
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } 
      catch (e) { return res.status(400).json({ error: 'Invalid JSON' }); }
    }

    const { items, customer, amount, currency, txRef } = body;

    if (!items || !customer || !amount || !currency || !txRef) {
      return res.status(400).json({ error: 'Missing required fields' });
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

    // 3. Create Stripe Session
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

    // 4. Save to Database (Safely wrapped)
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
      } catch (kvError) {
        console.error('KV Error:', kvError.message);
      }
    }

    // 5. Send Email (Safely wrapped)
    if (resend) {
      try {
        const currencySymbol = currency === 'GBP' ? '£' : '';
        await resend.emails.send({
          from: 'BX CLUB <onboarding@resend.dev>',
          to: ['bxclubhq@gmail.com'],
          replyTo: customer.email,
          subject: `🛍️ New Order Received — ${txRef}`,
          html: `<h1>New Order: ${txRef}</h1><p>Total: ${currencySymbol}${amount}</p>`,
        });
      } catch (emailError) {
        console.error('Email Error:', emailError.message);
      }
    }

    // 6. Return Success
    return res.status(200).json({ url: session.url });
    
  } catch (error) {
    console.error('API Crash:', error.message);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
