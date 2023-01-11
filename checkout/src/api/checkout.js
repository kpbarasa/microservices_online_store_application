const { CUSTOMER_BINDIG_KEY, SHOPPING_BINDING_KEY } = require('../config');
const CheckoutService = require('../services/checkout-service');
const { RPCObserver } = require('../utils');
const UserAuth = require('./middlewares/auth')
// const { PublishShoppingEvent, PublishCustomerEvent } = require('../utils/index')

module.exports = (app, channel) => {

  const service = new CheckoutService();

  RPCObserver("CHECKOUT_RPC", service);

  // Stripe
  app.post('/stripe', UserAuth, async (req, res, next) => {

    try {
      const { _id } = req.user
      const { items, shippingArea, shippingLocation, shippingCost } = req.body;
      const data = await service.paymentStripe(_id, items, shippingArea, shippingLocation, shippingCost);
      res.json(data);

    } catch (error) {
      next();
    }

  })

  app.get('/stripe/success/:customerId/:orderId', async (req, res, next) => {

    try {

      const customerId = req.params.customerId;
      const orderId = req.params.orderId;
      const data = await service.paymentStripeSuccess(customerId, orderId);
      res.json(data);

    } catch (error) {

      next();

    }

  })

  app.get('/stripe/cancle', async (req, res, next) => {

    try {
      const data = await service.paymentStripeCancle()
      res.json(data)

    } catch (error) {
      next()
    }

  })

  // M-Pesa 
  app.get('/access-token', async (req, res, next) => {

    const accessToken = await service.mpesaAccessToken()
    res.json(accessToken)

  })

  app.post('/mpesa', UserAuth, async (req, res, next) => {
    try {

      const { _id } = req.user
      const { items, amount, phoneNo } = req.body
      const data = await service.paymentMpesa(_id, items, amount, phoneNo)
      res.json(data)

    } catch (error) {
      next()
    }

  })

  app.post('/mpesa/qr', UserAuth, async (req, res, next) => {
    try {

      const { _id } = req.user
      const { amount, phoneNo } = req.body
      const data = await service.paymentGenerateQR(_id, amount)
      res.json(data)

    } catch (error) {
      next()
    }
  })

  app.get('/mpesa/callback/:userId/:orderId', async (req, res, next) => {
    try {
      const customerId = req.params.customerId;
      const orderId = req.params.orderId;
      const data = await service.paymentMpesaCallback(req, customerId, orderId)
      res.json(data)

    } catch (error) {
      next()
    }

  })

  app.get('/mpesa/result', UserAuth, async (req, res, next) => {
    try {

      const { _id } = req.user
      const data = await service.paymentMpesaSession(_id)
      res.json(data)

    } catch (error) {
      next()
    }
  })

}