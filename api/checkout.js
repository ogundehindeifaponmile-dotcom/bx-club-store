const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

// Helper to enable CORS
const corsHandler = cors({ origin: true });

export default async function handler(req, res) {
  // Run CORS middleware
  await new Promise((resolve, reject) => {
    corsHandler(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customer, amount, currency, txRef } = req.body;

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.shortName || item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects amount in smallest currency unit (pence/kobo)
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      customer_email: customer.email,
      shipping_address_collection: {
        allowed_countries: ['NG', 'GB', 'US', 'CA'], // Add more countries if needed
      },
      metadata: {
        txRef: txRef,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerPhone: customer.phone
      },
      success_url: `${req.headers.origin}/?success=true&order=${txRef}`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
