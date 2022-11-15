const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const saleSchema = new Schema({
  customerId: {
    type: String,
    required: true,
    unique: true,
  },
  order_id: {
    type: String,
    unique: true,
    required: true,
  },

  payment_type: {
    type: String,
    required: true,
  },

  discout_rate: {
    type: Number,
    required: true,
  },

  discout: {
    type: Number
  },

  tax: {
    type: Number,
    required: true,
  },

  tax_rate: {
    type: Number,
    required: true,
  },

  sub_total: {
    type: Number,
    required: true,
  },

  net_total: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    default: 'complete',
    enum: ['pending', 'cancled', 'complete'],
  },
  items: [
    {
      product: {
        _id: { type: String, require: true },
        name: { type: String },
        desc: { type: String },
        banner: { type: String },
        type: { type: String },
        unit: { type: Number },
        price: { type: Number },
        suplier: { type: String },
      },
      unit: { type: Number, require: true }
    }
  ],
  shipping: [
    {
      area: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      cost: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        default: 'Processing',
        enum: ['Processing', 'pending', 'onroute', 'complete']
      }
    }
  ]
},
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      }
    },
    timestamps: true
  });

const sales = mongoose.model('sales', saleSchema);

module.exports = sales;