import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const POST = async (req, res) => {
  const cartItems = await req.json()
  if (req.method === 'POST') {
    
    try {
      const params = {
        submit_type: 'pay',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1Oc7N1E8DIEE8FdRBpvl7Mon' },
          { shipping_rate: 'shr_1Oc7P7E8DIEE8FdRFfoLcT6z' }
        ],
        line_items: cartItems.map((item) => {
          return {
            price_data: {
              currency: 'sgd',
              product_data: {
                name: item.title,
              },
              unit_amount: item.price * 100
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1
            },
            quantity: item.quantity
          }
        }),
        mode: 'payment',
        success_url: 'https://arto-lac.vercel.app/',
        cancel_url: 'https://arto-lac.vercel.app/',
        automatic_tax: { enabled: true },
      }
      const session = await stripe.checkout.sessions.create(params);
      const jsonResponse = JSON.stringify(session);
      return new Response(jsonResponse, {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.log(req.headers.origin);
      const errorMessage = { error: 'An error occurred while processing your request' };
      return new Response(JSON.stringify(errorMessage), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { 'Allow': 'POST' }
    });
  }
}
