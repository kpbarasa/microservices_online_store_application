const { ShoppingRepository } = require("../database");
const { FormatReciept, RPCRequest } = require("../utils");
const axios = require('axios');

// All Business logic will be here
class ShoppingService {

  constructor() {
    this.repository = new ShoppingRepository();
  }

  // Cart Info
  async AddCartItem(customerId, product_id, qty) {
    // Grab product info from product Service through RPC
    const productResponse = await RPCRequest("PRODUCT_RPC", {
      type: "VIEW_PRODUCT",
      data: product_id,
    });

    if (productResponse && productResponse._id) {
      const data = await this.repository.ManageCart(
        customerId,
        productResponse,
        qty
      );

      return data;
    }

    throw new Error("Product data not found!");
  }

  async RemoveCartItem(customerId, product_id) {
    return await this.repository.ManageCart(
      customerId,
      { _id: product_id },
      0,
      true
    );
  }

  async GetCart(_id) {
    return this.repository.Cart(_id);
  }

  async updateCartProduct_Qty(customerId, product_id, qty) {

    const data = await this.repository.ManageCart(
      customerId,
      { _id: product_id },
      qty,
      false
    );

    return data;

  }

  // Wishlist
  async AddToWishlist(customerId, product_id, qty) {

    const productResponse = await RPCRequest("PRODUCT_RPC", {
      type: "VIEW_PRODUCT",
      data: product_id,
    });



    if (productResponse && productResponse._id) {

      const data = await this.repository.ManageWishlist(
        customerId,
        productResponse,
        qty
      );

      return data;
    }


  }

  async GetWishlist(customerId) {
    const wishlist = await this.repository.GetWishlistByCustomerId(customerId);

    if (!wishlist) {
      return {};
    }
    const { items } = wishlist;

    return wishlist;

    return {};
  }

  async RemoveFromWishlist(customerId, product_id) {
    return this.repository.ManageWishlist(customerId, product_id, 0, true);
  }

  // Orders
  async CreateOrder(customerId, txnNumber) {
    return this.repository.CreateNewOrder(customerId, txnNumber);
  }

  async GetOrder(orderId) {
    return this.repository.Orders("", orderId);
  }

  async GetOrders(customerId) {
    return this.repository.Orders(customerId);
  }

  async CheckOutOrder(customerId, orderId, paymentType, token) {

    // User info
    const phoneNo = '0703553986';

    // Order Info
    const order = await this.repository.Orders("", orderId)
    const oredr_data = JSON.stringify(order);

    if (paymentType === "STRIPE") {

      // Grab Checkout info from Checkout Service through RPC
      const checkOutResponse = await RPCRequest("CHECKOUT_RPC", {
        type: "CHECKOUT_STRIPE_RPC",
        data: { customerId, oredr_data },
      });

      return checkOutResponse;

      // if (checkOutResponse) {

      //   const data = await this.repository.CheckOut(
      //     customerId,
      //     orderId,
      //     paymentType
      //   );

      //   return FormateData(data);

      // }

    }

    else if (paymentType === "MPESA") {

      // Grab Checkout info from Checkout Service through RPC
      const checkOutResponse = await RPCRequest("CHECKOUT_RPC", {
        type: "CHECKOUT_MPESA_RPC",
        data: { customerId, oredr_data, phoneNo, token },
      });

      console.log(checkOutResponse);

      // if (checkOutResponse) {

      //   // M-PESA REPOSITORY CALL BACK
      //   const data = await axios.get('http://localhost:8004/mpesa/callback');
      //   return data

      // }

      return checkOutResponse;

    }

    else if (paymentType === "PAYPAL") {

      // Grab Checkout info from Checkout Service through RPC
      const checkOutResponse = await RPCRequest("CHECKOUT_RPC", {
        type: "CHECKOUT_PAYPAL_RPC",
        data: { oredr_data },
      });

      console.log(checkOutResponse);
      return checkOutResponse;


    }


  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      default:
        break;
    }
  }

  async deleteProfileData(customerId) {
    return this.repository.deleteProfileData(customerId);
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    switch (event) {
      case "DELETE_PROFILE":
        await this.deleteProfileData(data.userId);
        break;
      default:
        break;
    }
  }

  // async GetOrderPayload(userId, order, event) {
  //   if (order) {
  //     const payload = {
  //       event: event,
  //       data: { userId, order },
  //     };

  //     return payload;
  //   } else {
  //     return FormateData({ error: "No Order Available" });
  //   }
  // }

}

module.exports = ShoppingService;