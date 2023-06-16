const mongoose = require("mongoose");
const { status } = require("../utils/statusEnum");

const CartSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  reviews: [Number],
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seller: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: [
      status.ordered,
      status.inProcess,
      status.shipped,
      status.inTransit,
      status.delivered,
    ],
    default: status.ordered,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
