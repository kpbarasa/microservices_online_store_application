const { ShippingModel, SalesModel, CouponsModel } = require('../models');
const { APIError, BadRequestError, STATUS_CODES } = require('../../utils/app-errors')

//Dealing with data base operations
class SalesRepository {

    async ProcessSales({ user_id, order_id, payment_type, shipping, discout_rate }) {
        try {
            const tax_rate = 0.04
            const sub_total = 0000
            const discout = discout_rate * sub_total
            const net_total = tax_rate * sub_total + discout


            const sale = new SalesModel({
                user_id,
                order_id,
                payment_type,
                discout_rate,
                discout,
                tax_rate,
                sub_total,
                net_total,
                shipping
            })

            const salesResult = await sale.save();

            return salesResult;

        } catch (error) {

        }
    }

    async CancleSale({sales_id }) {

        const UpdateSale_Body = {
            status: "cancled"
        }

        await SalesModel.findOneAndUpdate({ _id: sales_id }, UpdateSale_Body, {
            new: true,
            runValidators: true,
        })

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

module.exports = CustomerRepository;