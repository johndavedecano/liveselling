const mongoose = require('mongoose')

const { Schema } = mongoose

const OrderSchema = new mongoose.Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'User' },
    customer: { type: Schema.Types.ObjectId, ref: 'User' },
    instruction: String,
    address: String,
    city: String,
    province: String,
    country: { type: String, default: 'PH' },
    zipcode: String,
    status: { type: String, default: 'pending' },
  },
  { timestamps: true },
)

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order
