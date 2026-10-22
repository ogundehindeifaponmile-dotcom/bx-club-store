import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Conversion rates (update these as needed)
const NGN_TO_USD = 1600; // 1 USD = 1600 NGN (approximate)
const GBP_TO_USD = 1.27; // 1 GBP = 1.27 USD (approximate)

export async function POST(req) {
  try {
    const { items, customer, currency, shippingCost } = await req.json();

    console.log('Checkout request:', { currency, itemsCount: items.length, shippingCost });

    // Convert all amounts to USD (Stripe's most universally supported currency)
    let conversionRate = 1;
    if (currency === 'ngn') {
      conversionRate = 1 / NGN_TO_USD; // Convert NGN to USD
    } else if (currency === 'gbp') {
      conversionRate = GBP_TO_USD; // Convert GBP to USD
    }

    const lineItems = items.map(item => {
      // Get the price in the original currency
      const originalPrice = currency === 'ngn' ? item.priceNGN : item.priceGBP;
      
      // Convert to USD
      const usdPrice = originalPrice * conversionRate;
      
      // Stripe requires amounts in cents (multiply by 100)
      const unitAmount = Math.round(usdPrice * 100);
      
      console.log(`Item: ${item.name}, Original: ${originalPrice} ${currency.toUpperCase()}, USD: ${usdPrice}, Stripe amount: ${unitAmount}`);
      
      return {
        price_data: {
          currency: 'usd', // Always use USD for Stripe
          product_data: { 
            name: item.name, 
            images: item.image ? [item.image] : [] 
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity || 1,
      };
    });

    // Add shipping
    if (shippingCost > 0) {
      const usdShipping = shippingCost * conversionRate;
      const shippingAmount = Math.round(usdShipping * 100);
      
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: shippingAmount,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      success_url: `https://bx-club-store.vercel.app/index.html?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://bx-club-store.vercel.app/index.html?canceled=true`,
      metadata: {
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerPhone: customer.phone,
        customerAddress: `${customer.address}, ${customer.city}, ${customer.postal}, ${customer.country}`,
        originalCurrency: currency.toUpperCase(),
      }
    });

    console.log('Stripe session created:', session.id);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
