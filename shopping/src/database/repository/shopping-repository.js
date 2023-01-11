const { CustomerModel, ProductModel, OrderModel, CartModel, WishlistModel } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { APIError, BadRequestError } = require('../../utils/app-errors')


//Dealing with data base operations
class ShoppingRepository {

  // Cart
  async Cart(customerId) {
    return CartModel.findOne({ customerId });
  }

  async ManageCart(customerId, product, qty, isRemove) {

    const cart = await CartModel.findOne({ customerId });

    if (cart) { // Check if cart exists.

      if (isRemove === false) { // handles update cart item quantity unit.

        const cartIndex = cart.items.findIndex(function (item) { // Get product cart Index.

          return item.product._id === product._id;

        });

        cart.items[cartIndex].unit = qty; // Update quantity.

      }

      else if (isRemove === true) { // handle remove case.

        const cartItems = cart.items.filter( // Filter selected product from cart Items.

          (item) => item.product._id !== product._id

        );

        cart.items = cartItems;

      }

      else { // handle add quantity  unit. 

        const cartIndex = cart.items.findIndex(function (item) {

          return item.product._id === product._id;

        });

        if (cartIndex > -1) { // if cart item quantity index is  > -1 add product quantity.

          const new_unit = cart.items[cartIndex].unit + qty;

          cart.items[cartIndex].unit = new_unit;

        } else { // if cart item quantity index is  < -1 add product to cart.

          cart.items.push({ product: { ...product }, unit: qty });

        }

      }

      return await cart.save(); // Save cart.

    }

    else { // If cart does not exists create a new Cart. 

      return await CartModel.create({
        customerId,
        items: [{ product: { ...product }, unit: qty }],
      });

    }

  }

  async ManageWishlist(customerId, product, qty, isRemove) {

    const wishlist = await WishlistModel.findOne({ customerId });

    if (wishlist) {// Check if Wishlist exists

      if (isRemove === false) { // handle remove case.

        const wishlistIndex = wishlist.items.findIndex(function (item) { // Get product cart Index.

          return item.product._id === product._id;

        });

        wishlist.items[wishlistIndex].unit = qty; // Update quantity.

      }

      else if (isRemove === true) {// handle remove case

        const wishlistItems = wishlist.items.filter( // Filter selected product from cart Items

          (item) => item.product._id !== product

        );
        wishlist.items = wishlistItems;
        // handle remove case
      }

      else {// handle add quantity  unit 

        const wishlistIndex = wishlist.items.findIndex(function (item) {

          return item.product._id === product._id;

        });

        if (wishlistIndex > -1) { // if cart item quantity index is  > -1 add product quantity

          const new_unit = wishlist.items[wishlistIndex].unit + qty;

          wishlist.items[wishlistIndex].unit = new_unit;

        } else { // if cart item quantity index is  < -1 add product to cart

          wishlist.items.push({ product: { ...product } });

        }

      }

      return await wishlist.save();

    } else {// If cart does not exists create a new Cart 

      // create a new one
      return await WishlistModel.create({
        customerId,
        items: [{ product: { ...product }, unit: qty }],
      });

    }

  }

  async GetWishlistByCustomerId(customerId) {
    return WishlistModel.findOne({ customerId });
  }

  async Orders(customerId, orderId) {

    if (orderId) {

      return OrderModel.findOne({ _id: orderId });

    } else {

      return OrderModel.find({ customerId });

    }

  }

  async CreateNewOrder(customerId, txnId) {
    const cart = await CartModel.findOne({ customerId: customerId });

    if (cart) {
      let amount = 0;

      let cartItems = cart.items;

      if (cartItems.length > 0) {
        //process Order

        cartItems.map((item) => {
          amount += parseInt(item.product.price) * parseInt(item.unit);
        });

        const orderId = uuidv4();

        const order = new OrderModel({
          orderId,
          customerId,
          amount,
          status: "received",
          // shipping: ["received"],
          items: cartItems,
        });

        cart.items = [];

        const orderResult = await order.save();
        await cart.save();
        return orderResult;
      }
    }

    return {};
  }

  async CheckOut(customerId, order_id, paymentInfo) {

    var data;

    const order = await OrderModel.findById({ _id: order_id });

    const { shipingInfoArea, shipingInfoLocation, shipingInfoCost, amount } = order;
    const order_items = order.items
    const items = [];

    order_items.map((item) => {
      // amount += parseInt(item.product.price) * parseInt(item.unit);
      items.push({ name: item.name, price:  item.price, quantity: item.quantity })
    });

    //Get customer payment info
    const { paymentType, userPaymentData } = paymentInfo;

    const payload = (order_ifo, paymet_type, paymet_status, shipping_info, shipping_status) => {

      return {
        order_ifo,
        paymet_type,
        paymet_status,
        shipping_info,
        shipping_status
      }
    };

    //STRIPE PAYMENT 
    if (paymentType === "STRIPE") {

      const stripe = stripeCheckout(customerId, shipingInfoArea, shipingInfoLocation, shipingInfoCost, amount)

      if (stripe) {

        order.status = "PAYED";
        order.shipping_status = "PENDING";

        data = payload(
          order,
          "STRIPE",
          order.status,
          shipping_info,
          order.shipping_status
        )

      }

    }

    //PAYPAL PAYMENT 
    else if (paymentType === "PAYPAL") {

      const { items, amount } = userPaymentData;

      const paypal = paypalCheckout(items, amount)

      if (paypal) {

        order.status = "PAYED";
        order.shipping_status = "PENDING";

        data = payload(
          order,
          "PAYPAL",
          order.status,
          shipping_info,
          order.shipping_status
        )

      }

    }

    //MPESA PAYMENT 
    else if (paymentType === "MPESA") {

      const { phone_no, amount } = userPaymentData;

      const m_pesa = m_pesaCheckout(phone_no, amount)

      if (m_pesa) {

        order.status = "PAYED";
        order.shipping_status = "PENDING";

        data = payload(
          order,
          "MPESA",
          order.status,
          shipping_info,
          order.shipping_status
        )

      }

    }

    console.log(data);

    await order.save(); //update order

    return data;

  }

  async CancleOrder(customerId, order_id) {

    const order = await OrderModel.findById({ _id: order_id });

    console.log(order);

  }

  async deleteProfileData(customerId) {
    return Promise.all([
      CartModel.findOneAndDelete({ customerId }),
      WishlistModel.findOneAndDelete({ customerId }),
    ]);
  }

}

module.exports = ShoppingRepository;