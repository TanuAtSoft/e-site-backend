const mongoose = require("mongoose");
const { status } = require("../utils/statusEnum");

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderedItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  deliveryAddress: {
    type: String,
    required:true
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
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type:Date,
     default: Date.now()   
  }
});

module.exports = mongoose.model("Order", OrderSchema);
