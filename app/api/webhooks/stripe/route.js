import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { items, customer, currency, shippingCost } = await req.json();

    const lineItems = items.map(item => {
      // Stripe requires amounts in the smallest currency unit (e.g., 100 kobo = 1 NGN)
      const basePrice = item.priceNGN || (item.priceGBP * 1800);
      const unitAmount = Math.round(basePrice * 100); 
      
      return {
        price_data: {
          currency: currency.toLowerCase(), // stripe requires lowercase: 'ngn', 'gbp', etc.
          product_data: { 
            name: item.name, 
            images: item.image ? [item.image] : [] 
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity || 1,
      };
    });

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      // IMPORTANT: Points back to index.html where your success logic lives
      success_url: `https://bx-club-store.vercel.app/index.html?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://bx-club-store.vercel.app/index.html?canceled=true`,
      metadata: {
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerPhone: customer.phone,
        customerAddress: `${customer.address}, ${customer.city}, ${customer.postal}, ${customer.country}`,
      }
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
