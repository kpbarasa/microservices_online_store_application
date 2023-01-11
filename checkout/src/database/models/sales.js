const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SalesSchema = new Schema({
    customer_id: { type: String, require: true },
    order_id: { type: String, require: true, unique: true },
    transaction_id: { type: String, require: true },
    // items: [
    //     {
    //         product: {
    //             _id: { type: String, require: true },
    //             name: { type: String },
    //             desc: { type: String },
    //             banner: { type: String },
    //             type: { type: String },
    //             unit: { type: Number },
    //             price: { type: Number },
    //             suplier: { type: String },
    //         },
    //         unit: { type: Number, require: true }
    //     }
    // ],
    provider: { type: String, require: true },
    payment_type: { type: String, require: true },
    total_amount: { type: Number, require: true },
    amount: [
        {
            amount_discount: { type: String },
            amount_shipping: { type: String },
            amount_tax: { type: String }
        }
    ],
    Sale_status: { type: String, require: true }
},
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            }
        },
        timestamps: true
    });

module.exports = mongoose.model('sales_checkout_repository', SalesSchema);