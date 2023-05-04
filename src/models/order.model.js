const mongoose = require("mongoose");
const { status } = require("../utils/statusEnum");

const OrderSchema = new mongoose.Schema({
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
  timestamps: { createdAt: "addedAt", updatedAt: "modifiedAt" },
});

module.exports = mongoose.model("Order", OrderSchema);
