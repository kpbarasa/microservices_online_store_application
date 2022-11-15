const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const couponSchema = new Schema({
  order_id: {
    type: String,
    required: true,  
    trim: true,
    minlength: 3
  },
  value: {
    type: Number,
    required: true, 
    trim: true,
    minlength: 3
  },
}, 
{
  timestamps: true,
});

const coupon_info = mongoose.model('coupon', couponSchema);

module.exports = coupon_info;