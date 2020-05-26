const mongoose = require('mongoose')

const { Schema } = mongoose

var mongoosePaginate = require('mongoose-paginate')

const ProductSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    price: String,
    description: String,
    photos: [{ type: String }],
  },
  { timestamps: true },
)

ProductSchema.plugin(mongoosePaginate)

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
