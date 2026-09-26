const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customer, amount, currency, txRef } = req.body;

    if (!items || !customer || !amount || !txRef) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Determine Stripe currency code (gbp or ngn)
    const stripeCurrency = currency === 'GBP' ? 'gbp' : 'ngn';

    // Create Stripe line items
    const lineItems = items.map(item => {
      const priceInSmallestUnit = Math.round(item.price * 100); // Stripe uses smallest unit (pence/kobo)
      return {
        price_data: {
          currency: stripeCurrency,
          product_data: {
            name: item.shortName || item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: priceInSmallestUnit,
        },
        quantity: item.quantity || 1,
      };
    });

    // Add shipping as a separate line item
    const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shippingAmount = amount - subtotal;
    
    if (shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: stripeCurrency,
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(shippingAmount * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      metadata: {
        txRef: txRef,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerPhone: customer.phone,
      },
      success_url: `${req.headers.origin || 'https://bxclubhq.com'}?success=true&order=${txRef}`,
      cancel_url: `${req.headers.origin || 'https://bxclubhq.com'}?canceled=true`,
    });

    // Send admin notification email via Resend
    const currencySymbol = currency === 'GBP' ? '£' : '₦';
    const itemsList = items.map(item => 
      `<li style="margin-bottom: 8px;">${item.shortName || item.name} × ${item.quantity} — ${currencySymbol}${(item.price * item.quantity).toLocaleString()}</li>`
    ).join('');

    // NOTE: If you haven't verified your domain in Resend yet, you MUST use 'onboarding@resend.dev' as the 'from' address.
    // Once verified, change it to 'orders@bxclubhq.com'
    await resend.emails.send({
      from: 'BX CLUB Orders <onboarding@resend.dev>', 
      to: ['bxclubhq@gmail.com'],
      subject: `🛍️ New Order Received — ${txRef}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 8px;">
          <h1 style="color: #FFD700; margin-bottom: 8px;">New Order Received!</h1>
          <p style="color: #888; margin-bottom: 24px;">A customer just placed an order on BX CLUB.</p>
          
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #FFD700; margin-bottom: 12px; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">Order Reference</h3>
            <p style="font-size: 18px; font-weight: bold; color: #FFD700; margin: 0;">#${txRef}</p>
          </div>

          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #FFD700; margin-bottom: 12px; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">Customer Details</h3>
            <p style="margin: 4px 0;"><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> ${customer.email}</p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> ${customer.phone}</p>
          </div>

          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #FFD700; margin-bottom: 12px; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">Items Ordered</h3>
            <ul style="color: #fff; font-size: 14px; margin: 0; padding-left: 20px;">${itemsList}</ul>
          </div>

          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #FFD700;">
            <p style="margin: 0; font-size: 14px; color: #888;">Total Amount</p>
            <p style="margin: 4px 0 0 0; font-size: 28px; font-weight: bold; color: #FFD700;">${currencySymbol}${amount.toLocaleString()}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #888;">Currency: ${currency}</p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
}
