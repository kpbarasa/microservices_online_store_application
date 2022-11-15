const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shipping_info = new Schema({
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
},
  { timestamps: true, });

const shipping = mongoose.model('shipping_info', shipping_info);

module.exports = shipping;