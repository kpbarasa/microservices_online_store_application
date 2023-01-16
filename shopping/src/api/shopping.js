const { CUSTOMER_BINDIG_KEY, CHECKOUT_BINDIG_KEY } = require("../config");
const ShoppingService = require("../services/shopping-service");
const { SubscribeMessageChannel, PublishMessage } = require("../utils");
const UserAuth = require('./middlewares/auth');

module.exports = (app, channel) => {

    const service = new ShoppingService();
    SubscribeMessageChannel(channel, service)

    app.post('/order', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const { txnNumber } = req.body;

        try {
            const { data } = await service.PlaceOrder({ _id, txnNumber });

            const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER')

            // PublishCustomerEvent(payload)
            PublishMessage(channel, CUSTOMER_BINDIG_KEY, JSON.stringify(payload))

            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/orders', UserAuth, async (req, res, next) => {

        const { _id } = req.user;

        try {
            const { data } = await service.GetOrderDetails(_id);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }

    });

    app.put('/cart',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        const { data } = await service.AddCartItem(_id, req.body._id);
        
        res.status(200).json(data);

    });

    app.delete('/cart/:id',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        const { data } = await service.AddCartItem(_id, req.body._id);
        
        res.status(200).json(data);

    });
    
    app.get('/cart', UserAuth, async (req,res,next) => {
        console.log(req.user);

        const { _id } = req.user;
        
        const { data } = await service.GetCart({ _id });
        // console.log(data);

        return res.status(200).json(data);
    });
    
    // app.get('/wishlist', UserAuth, async (req,res,next) => {
    //     try {
    //         const { _id } = req.user;
    //         const  data  = await service.GetWishList( _id);
    //         return res.status(200).json(data);
            
    //     } catch (err) {
    //         next(err)
    //     }
    // });
    
    // app.get('/cart', UserAuth, async (req,res,next) => {
    //     try {
    //         const { _id } = req.user;
    //         const  data  = await service.GetWishList( _id);
    //         return res.status(200).json(data);
            
    //     } catch (err) {
    //         next(err)
    //     }
    // });
    
    app.post('/checkout', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const { txnNumber, orderId, paymentType } = req.body;
        

        try {

            const payload = await service.GetCheckoutPayload(_id, orderId, paymentType, 'CHECKOUT');

            // PublishCustomerEvent(payload)
            PublishMessage(channel, CHECKOUT_BINDIG_KEY, JSON.stringify(payload))

            // return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });
}