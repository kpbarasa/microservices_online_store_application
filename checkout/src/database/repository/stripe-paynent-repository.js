const { STRIPE_PRIVATE_KEY, PORT_URL } = require('../../config');
const axios = require('axios');
const stripe = require('stripe')(STRIPE_PRIVATE_KEY);
// const { APIError, BadRequestError, STATUS_CODES } = require('../../utils/app-errors')

var stripeSessionId = []

class StripePaymentRepo {
  
    async StripeService(customerId, oredr_data /*shipingInfoArea, shipingInfoLocation, shipingInfoCost*/) {

      // Get order cart items 
      const items = [];
      const order= JSON.parse(oredr_data)

      order.items.map(item => {

        items.push({quantity:item.unit, name:item.product.name, price:item.product.price });

      })

    try {

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        // shipping_options: [
        //   {
        //     shipping_rate_data: {
        //       type: 'fixed_amount',
        //       fixed_amount: {
        //         amount: Number(shipingInfoCost) * 100,
        //         currency: 'usd',
        //       },
        //       display_name: (shipingInfoArea + " - " + shipingInfoLocation).toString(),
        //       delivery_estimate: {
        //         minimum: {
        //           unit: 'business_day',
        //           value: 1,
        //         },
        //         maximum: {
        //           unit: 'business_day',
        //           value: 1,
        //         },
        //       }
        //     }
        //   },
        // ],

        line_items: items.map(item => {
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
              },
              unit_amount: item.price * 100,
            },
            quantity: item.quantity,
          }
        }),
        success_url: `${PORT_URL}/stripe/success/:${customerId}/:${order._id}`,
        cancel_url: `${PORT_URL}/stripe/cancle/:${customerId}/:${order._id}`,

      });

      stripeSessionId.push(session.id) 

      return { url: session.url, message:"Stripe checkout API URL" };

    } catch (error) {

      return { error };

    }

  }

  async StripeService_success() {
    
    try {
      const options = { headers: { 'Authorization': 'Bearer ' + STRIPE_PRIVATE_KEY } };

      const getSession = await axios.get(`https://api.stripe.com/v1/checkout/sessions/${stripeSessionId[0]}`, options)
        .then(res => res.data)

      const stripeResPayload = {
        transactionId: getSession.id,
        paymentMethod: getSession.payment_method_types,
        paymentTPlatform: "stripe",
        status: getSession.payment_status,
        subTotal: getSession.amount_subtotal,
        amountTotal: getSession.total_details // Array
      };

      return stripeResPayload;

    }
    catch (error) {
      return { error }
    }
  }

  async StripeService_cancle() { 

    const options = { headers: { 'Authorization': 'Bearer ' + STRIPE_PRIVATE_KEY } };

    const getSession = await axios.get(`https://api.stripe.com/v1/checkout/sessions/${stripeSessionId[0]}`, options)
      .then(res => res.data)
    
    const stripeResPayload = {
      transactionId: getSession.id,
      paymentMethod: getSession.payment_method_types,
      paymentTPlatform: "STRIPE",
      status: getSession.payment_status,
      subTotal: getSession.amount_subtotal,
      amountTotal: getSession.total_details // Array
    };

    return stripeResPayload;

  }

}

module.exports = StripePaymentRepo;