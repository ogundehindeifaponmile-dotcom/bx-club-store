import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { items, customer, currency, shippingCost } = body

    const conversionRate = currency === 'ngn' ? (1 / 1600) : (currency === 'gbp' ? 1.27 : 1)

    const lineItems = items.map(item => {
      const price = currency === 'ngn' ? item.priceNGN : item.priceGBP
      const usdPrice = price * conversionRate
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : []
          },
          unit_amount: Math.round(usdPrice * 100)
        },
        quantity: item.quantity || 1
      }
    })

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(shippingCost * conversionRate * 100)
        },
        quantity: 1
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer.email,
      success_url: 'https://bx-club-store.vercel.app/index.html?success=true&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://bx-club-store.vercel.app/index.html?canceled=true'
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
