const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    console.log('✅ Checkout API called. Body:', JSON.stringify(req.body, null, 2));
    
    const { items, customer, amount, currency, txRef } = req.body;

    // VALIDATE ALL REQUIRED FIELDS
    if (!items || !customer || !amount || !currency || !txRef) {
      console.error('❌ Missing required fields in checkout request');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!customer.email || !customer.firstName || !customer.lastName) {
      console.error('❌ Missing customer details');
      return res.status(400).json({ error: 'Missing customer details' });
    }

    // DETERMINE STRIPE CURRENCY
    const stripeCurrency = currency === 'GBP' ? 'gbp' : 'ngn';
    console.log(`💱 Using Stripe currency: ${stripeCurrency}`);

    // BUILD LINE ITEMS
    const lineItems = items.map(item => {
      const price = Math.round(item.price * 100); // Convert to cents/pence
      console.log(`📦 Item: ${item.shortName || item.name}, Price: ${price}, Qty: ${item.quantity || 1}`);
      
      return {
        price_data: {
          currency: stripeCurrency,
          product_data: { 
            name: item.shortName || item.name, 
            images: item.image ? [item.image] : [] 
          },
          unit_amount: price,
        },
        quantity: item.quantity || 1,
      };
    });

    // CALCULATE SHIPPING
    const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shippingAmount = amount - subtotal;
    
    console.log(`💰 Subtotal: ${subtotal}, Shipping: ${shippingAmount}, Total: ${amount}`);
    
    if (shippingAmount > 0) {
      lineItems.push({
        price_data: { 
          currency: stripeCurrency, 
          product_data: { name: 'Shipping' }, 
          unit_amount: Math.round(shippingAmount * 100) 
        },
        quantity: 1,
      });
    }

    // CREATE STRIPE SESSION
    console.log('💳 Creating Stripe session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      metadata: { 
        txRef, 
        customerName: `${customer.firstName} ${customer.lastName}`,
        amount: amount.toString(),
        currency: currency
      },
      success_url: `${req.headers.origin || 'https://bxclubhq.com'}?success=true&order=${txRef}`,
      cancel_url: `${req.headers.origin || 'https://bxclubhq.com'}?canceled=true`,
    });
    console.log('✅ Stripe session created:', session.id);

    // SAVE ORDER TO UPSTASH KV
    const orderData = { 
      txRef, 
      items, 
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || 'N/A',
        city: customer.city || 'N/A',
        country: customer.country || 'N/A',
        postal: customer.postal || 'N/A'
      },
      amount, 
      currency, 
      status: 'pending', 
      timestamp: new Date().toISOString() 
    };

    console.log('💾 Saving to Upstash KV...');
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) {
      console.error('❌ Missing KV Environment Variables!');
    } else {
      try {
        const kvRes = await fetch(`${kvUrl}/lpush/bx_orders`, {
          method: 'POST',
          headers: { 
            Authorization: `Bearer ${kvToken}`, 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify([JSON.stringify(orderData)])
        });
        
        if (!kvRes.ok) {
          throw new Error(`Upstash KV returned ${kvRes.status}`);
        }
        
        const kvData = await kvRes.json();
        console.log('✅ Upstash KV Response:', kvData);
      } catch (kvError) {
        console.error('❌ Failed to save to Upstash KV:', kvError);
        // Don't fail the checkout if KV save fails - we still have the order in Stripe
      }
    }

    // SEND ADMIN EMAIL
    console.log('📧 Sending admin email via Resend...');
    const currencySymbol = currency === 'GBP' ? '£' : '₦';
    const itemsList = items.map(item => 
      `<li style="margin-bottom: 8px;">${item.shortName || item.name} × ${item.quantity} — ${currencySymbol}${(item.price * item.quantity).toLocaleString()}</li>`
    ).join('');

    try {
      const emailRes = await resend.emails.send({
        from: 'BX CLUB <onboarding@resend.dev>', // ✅ GUARANTEED TO WORK - Resend sandbox
        to: ['bxclubhq@gmail.com'],
        replyTo: customer.email, // ✅ Customer can reply directly
        subject: `🛍️ New Order Received — ${txRef}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 8px;">
            <h1 style="color: #FFD700; margin-top: 0;">New Order Received!</h1>
            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #FFD700; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Order #${txRef}</p>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${customer.firstName} ${customer.lastName}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${customer.email}</p>
              <p style="margin: 10px 0;"><strong>Phone:</strong> ${customer.phone}</p>
              <p style="margin: 10px 0;"><strong>Address:</strong> ${customer.address || 'N/A'}, ${customer.city || 'N/A'}, ${customer.country || 'N/A'} ${customer.postal || 'N/A'}</p>
            </div>
            <h3 style="color: #FFD700;">Items Ordered:</h3>
            <ul style="color: #fff; padding-left: 20px;">${itemsList}</ul>
            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #FFD700; margin-top: 20px;">
              <p style="margin: 0; font-size: 14px; color: #888;">Total Amount</p>
              <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #FFD700;">${currencySymbol}${amount.toLocaleString()}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">This order is pending payment confirmation via Stripe.</p>
          </div>
        `,
      });
      console.log('✅ Resend email sent successfully:', emailRes);
    } catch (emailError) {
      console.error('❌ Failed to send admin email:', emailError);
      // Don't fail the checkout if email fails - we still have the order in Stripe and KV
    }

    // RETURN SUCCESS
    console.log('✅ Checkout completed successfully');
    res.status(200).json({ url: session.url });
    
  } catch (error) {
    console.error('❌ Checkout API CRASHED:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
