const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, customer, amount, currency, txRef } = req.body;
    const stripeCurrency = currency === 'GBP' ? 'gbp' : 'ngn';

    const lineItems = items.map(item => ({
      price_data: {
        currency: stripeCurrency,
        product_data: { name: item.shortName || item.name, images: item.image ? [item.image] : [] },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shippingAmount = amount - subtotal;
    if (shippingAmount > 0) {
      lineItems.push({
        price_data: { currency: stripeCurrency, product_data: { name: 'Shipping' }, unit_amount: Math.round(shippingAmount * 100) },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      metadata: { txRef, customerName: `${customer.firstName} ${customer.lastName}` },
      success_url: `${req.headers.origin || 'https://bxclubhq.com'}?success=true&order=${txRef}`,
      cancel_url: `${req.headers.origin || 'https://bxclubhq.com'}?canceled=true`,
    });

    // SAVE FULL ORDER WITH DELIVERY DETAILS
    const orderData = { 
      txRef, 
      items, 
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        country: customer.country,
        postal: customer.postal
      },
      amount, 
      currency, 
      status: 'pending', 
      timestamp: new Date().toISOString() 
    };
    
    await fetch(`${process.env.STORAGE_URL}/lpush/bx_orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.STORAGE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([JSON.stringify(orderData)])
    });

    // Send Admin Email
    const currencySymbol = currency === 'GBP' ? '£' : '₦';
    const itemsList = items.map(item => `<li style="margin-bottom: 8px;">${item.shortName || item.name} × ${item.quantity} — ${currencySymbol}${(item.price * item.quantity).toLocaleString()}</li>`).join('');

    await resend.emails.send({
      from: 'BX CLUB Orders <onboarding@resend.dev>', 
      to: ['bxclubhq@gmail.com'],
      subject: `🛍️ New Order Received — ${txRef}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 8px;">
          <h1 style="color: #FFD700;">New Order Received!</h1>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #FFD700; font-size: 18px; font-weight: bold; margin: 0;">#${txRef}</p>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${customer.email}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${customer.phone}</p>
            <p style="margin: 10px 0;"><strong>Address:</strong> ${customer.address}, ${customer.city}, ${customer.country === 'uk' ? 'United Kingdom' : 'Nigeria'} ${customer.postal}</p>
          </div>
          <ul style="color: #fff; padding-left: 20px;">${itemsList}</ul>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #FFD700;">
            <p style="margin: 0; font-size: 28px; font-weight: bold; color: #FFD700;">${currencySymbol}${amount.toLocaleString()}</p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ error: error.message });
  }
}
