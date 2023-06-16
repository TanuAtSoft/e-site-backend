const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  brand: {
    type: String,
    required: true,
  },
  main_category: {
    type: String,
  },
  sub_category: {
    type:String,
  },
  images: [String],
  description: {
    type: [String],
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  softDeleted: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  discounts: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  seller: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  reviews: [Number],
});

module.exports = mongoose.model("Product", ProductSchema);
