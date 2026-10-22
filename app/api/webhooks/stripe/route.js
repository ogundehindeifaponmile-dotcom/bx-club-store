import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return new Response('Webhook Error', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    console.log('Payment successful:', session.id)

    try {
      await resend.emails.send({
        from: 'BX CLUB <onboarding@resend.dev>',
        to: session.customer_email,
        subject: 'Order Confirmation - BX CLUB',
        html: '<h1>Thank You for Your Order</h1><p>Your order has been received.</p>'
      })
    } catch (emailError) {
      console.error('Email error:', emailError)
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
