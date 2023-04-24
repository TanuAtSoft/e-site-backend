const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  brand:{
  type:String,
  required: true,
  },
  category: {
    type: String,
    required: true,
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
  seller: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  reviews: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
