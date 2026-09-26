import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const txRef = session.metadata?.txRef;
    const customerName = session.metadata?.customerName || 'Customer';
    const customerEmail = session.customer_email || session.customer_details?.email;

    // Get line items for receipt
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const currencySymbol = session.currency === 'gbp' ? '£' : '₦';
    
    const itemsHtml = lineItems.data.map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #333;">${item.description}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #333; text-align: right; color: #FFD700; font-weight: bold;">
          ${currencySymbol}${(item.amount_total / 100).toLocaleString()}
        </td>
      </tr>
    `).join('');

    // Send customer receipt
    try {
      await resend.emails.send({
        from: 'BX CLUB <orders@bxclubhq.com>',
        to: [customerEmail],
        subject: `✅ Order Confirmed — #${txRef}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background: rgba(255,215,0,0.1); border: 2px solid #FFD700; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: #FFD700; font-size: 28px;">✓</span>
              </div>
              <h1 style="color: #FFD700; margin: 0; font-size: 24px;">Thank You, ${customerName.split(' ')[0]}!</h1>
              <p style="color: #888; margin-top: 8px;">Your order has been received and is being prepared.</p>
            </div>

            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #FFD700; margin: 0 0 12px 0; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;">Order Reference</h3>
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #FFD700;">#${txRef}</p>
            </div>

            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #FFD700; margin: 0 0 16px 0; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;">Items Ordered</h3>
              <table style="width: 100%; border-collapse: collapse;">${itemsHtml}</table>
              <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #333; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #888; font-size: 14px;">Total Paid</span>
                <span style="color: #FFD700; font-size: 22px; font-weight: bold;">${currencySymbol}${(session.amount_total / 100).toLocaleString()}</span>
              </div>
            </div>

            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #FFD700; margin: 0 0 12px 0; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;">What's Next?</h3>
              <p style="color: #ccc; font-size: 14px; line-height: 1.6; margin: 0;">
                Your order is being carefully prepared by our team. We'll send you another email with tracking information once your package has been shipped.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #222;">
              <p style="color: #666; font-size: 12px; margin: 0;">Need help? Reply to this email or WhatsApp us at +44 7538 277711</p>
              <p style="color: #FFD700; font-size: 14px; margin-top: 12px; font-weight: bold;">BX CLUB</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send customer email:', emailError);
    }

    // Notify admin of successful payment
    try {
      await resend.emails.send({
        from: 'BX CLUB Orders <orders@bxclubhq.com>',
        to: ['bxclubhq@gmail.com'],
        subject: `💰 PAYMENT CONFIRMED — ${txRef}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 8px;">
            <h1 style="color: #4ade80; margin-bottom: 8px;">💰 Payment Confirmed!</h1>
            <p style="color: #888; margin-bottom: 24px;">Order <strong style="color: #FFD700;">#${txRef}</strong> has been paid successfully.</p>
            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #4ade80;">
              <p style="margin: 0; color: #888; font-size: 12px;">Amount Received</p>
              <p style="margin: 4px 0 0 0; font-size: 28px; font-weight: bold; color: #4ade80;">${currencySymbol}${(session.amount_total / 100).toLocaleString()}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">Customer receipt has been sent automatically.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send admin confirmation email:', emailError);
    }
  }

  res.status(200).json({ received: true });
}
