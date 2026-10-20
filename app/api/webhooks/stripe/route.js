import Stripe from 'stripe';
import { Resend } from 'resend';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('💰 Payment successful:', session.id);

    try {
      await resend.emails.send({
        from: 'BX CLUB <onboarding@resend.dev>',
        to: session.customer_email,
        subject: 'Order Confirmation - BX CLUB',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #0a0a0a;">Thank You for Your Order</h1>
            <p>Your order has been received and is being prepared.</p>
            <p><strong>Order Reference:</strong> ${session.id}</p>
            <p><strong>Total Paid:</strong> ${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}</p>
            <br>
            <p>If you have any questions, reply to this email or chat with us on WhatsApp.</p>
          </div>
        `,
      });
      console.log('✅ Email sent to:', session.customer_email);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}

export const config = { api: { bodyParser: false } };
