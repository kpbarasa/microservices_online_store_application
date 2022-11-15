const { ShippingModel, SalesModel, CouponsModel, OrdersModel } = require('../models');
const { APIError, BadRequestError, STATUS_CODES } = require('../../utils/app-errors')

//Dealing with data base operations
class SalesRepository {

    async Checkout(customerId, order_id) {

        try {
            // Get order 
            const orders = await OrdersModel.findOne({ order_id });

            if (orders) {

                // Get Shipping info 
                const shipping = {
                    area: "store",
                    location: "store",
                    cost: 300,
                    status: "Processing"
                }

                const sub_total = orders.amount
                const tax_rate = 0.04
                const tax = tax_rate * sub_total
                const discout_rate = 0.05
                const discout = discout_rate * sub_total
                const net_total = sub_total - discout - tax + shipping.cost

                // Check payment 
                const payment_type = "default"

                // Save sale object 
                const sale = new SalesModel({
                    customerId,
                    order_id,
                    payment_type,
                    discout_rate,
                    discout,
                    tax_rate,
                    tax,
                    sub_total,
                    net_total,
                    shipping,
                    items: orders.items
                })

                const salesResult = await sale.save();
                console.log(salesResult);

                return salesResult;
            }

        } catch (error) {

        }
    }

    async CancleCheckout(customerId, order_id) {

        const UpdateSale_Body = {
            status: "cancled"
        }

        const data = await SalesModel.findOneAndUpdate({ order_id, customerId }, UpdateSale_Body, {
            new: true,
            runValidators: true,
        })

        return data;

    }

    async ReCheckout(customerId, order_id) {

        const UpdateSale_Body = {
            status: "complete"
        }

        const data = await SalesModel.findOneAndUpdate({ order_id, customerId }, UpdateSale_Body, {
            new: true,
            runValidators: true,
        })

        return data;

    }

    async SuspendCheckout(customerId, order_id) {

        const UpdateSale_Body = {
            status: "pending"
        }

        const data = await SalesModel.findOneAndUpdate({ order_id, customerId }, UpdateSale_Body, {
            new: true,
            runValidators: true,
        })

        return data;

    }

    async GetShippingList({ order_id, area, location, cost, shipping_status }) {
        try {
            return await ShippingModel.find();
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Get Shipping lists')
        }
    }

    async ProcessShipping({ order_id, area, location, cost, shipping_status }) { }

    async AddShippingLocation({ area, location, cost }) {

        try {
            const location = new ShippingModel({
                area, location, cost
            })

            const locationResult = await location.save();
            return locationResult;

        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Shipping Location')
        }

    }

    async RemoveShippingLocation({ id }) {
        try {
            return await ShippingModel.findByIdAndDelete(id);
        } catch (err) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Delete Shipping Location')
        }
    }

}

module.exports = SalesRepository;