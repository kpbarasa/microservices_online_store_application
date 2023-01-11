// TODO: 
// 1. ADD SAVE CART
// 2. ADD SAVE WISHLIST 
// 3. ADD SAVE ORDER

const { CUSTOMER_BINDIG_KEY } = require("../config");
const ShoppingService = require("../services/shopping-service");
const UserAuth = require('./middlewares/auth');
const mpesaAccessToken = require('./middlewares/mpesa-access-token');

module.exports = (app, channel) => {

    const service = new ShoppingService();

    // Cart
    app.post("/cart", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const { product_id, qty } = req.body;
        const { data } = await service.AddCartItem(_id, product_id, qty);
        res.status(200).json(data);
    });

    app.get("/cart", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const data = await service.GetCart(_id);
        return res.status(200).json(data);
    });

    app.post("/cart/update/:cart_id", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const cart_id = req.params.cart_id;
        const {product_id, qty} = req.body;
        const data = await service.updateCartProduct_Qty(_id, product_id, qty);
        return res.status(200).json(data);
    });

    app.delete("/cart/:product_id", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const productId = req.params.product_id;
        const { data } = await service.RemoveCartItem(_id, productId);
        res.status(200).json(data);
    });

    // Wishlist
    app.post("/wishlist", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const { product_id, qty } = req.body;
        const data = await service.AddToWishlist(_id, product_id, qty);
        return res.status(200).json(data);
    });
    app.get("/wishlist", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const data = await service.GetWishlist(_id);
        return res.status(200).json(data);
    });
    app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const product_id = req.params.id;
        const data = await service.RemoveFromWishlist(_id, product_id);
        return res.status(200).json(data);
    });

    // Orders
    app.post("/order", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const { txnNumber } = req.body;
        const data = await service.CreateOrder(_id, txnNumber);
        return res.status(200).json(data);
    });

    app.get("/order/:id", UserAuth, async (req, res, next) => {
        const _id  = req.params.id;
        const data = await service.GetOrder(_id);
        return res.status(200).json(data);
    });

    app.get("/orders", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const data = await service.GetOrders(_id);
        return res.status(200).json(data);
    });


    // Check out 
    app.get("/checkout/stripe/:order_id", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const order_id  = req.params.order_id;
        const token =""
        const data = await service.CheckOutOrder(_id, order_id, "STRIPE", token);
        return res.status(200).json(data);
    });

    app.get("/checkout/m-pesa/:order_id", UserAuth, mpesaAccessToken, async (req, res, next) => {
        console.log(req.access_token);
        const { _id } = req.user;
        const order_id  = req.params.order_id;
        const token = req.access_token
        const data = await service.CheckOutOrder(_id, order_id, "MPESA", token);
        return res.status(200).json(data);
    });
    
    
}