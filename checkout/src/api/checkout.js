const { CUSTOMER_BINDIG_KEY } = require("../config");
const CheckoutService = require("../services/checkout-service");
const { SubscribeMessageChannel, PublishMessage } = require("../utils");
const UserAuth = require('./middlewares/auth');

module.exports = (app, channel) => {

    const service = new CheckoutService();

    SubscribeMessageChannel(channel, service);
    
    app.post('/checkout', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const { txnNumber, orderId, paymentType } = req.body;

        try {
            const { data } = await service.CheckOut(_id, orderId, paymentType);

            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/success', UserAuth, async (req, res, next) => {


        try {
            const { data } = await service.SuccessCheckout();

            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.post('/cancle', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const { txnNumber, orderId } = req.body;

        try {
            const { data } = await service.CancleCheckOut(_id, orderId);

            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });
    
}