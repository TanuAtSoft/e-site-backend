const mongoose = require("mongoose");
const { payment } = require("../utils/paymentEnum");
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
  buyerName:{
  type:String,
  },
  orderedItems: [
    {
      productId: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      title: {
        type: String,
      },
      brand: {
        type: String,
      },
      image: {
        type: String,
      },
      price: {
        type: Number,
      },
      rating:{
        type:Number,
        default:0,
      },
      seller: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
      buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status:{
        type: String,
        enum: [
          status.ordered,
          status.inProcess,
          status.shipped,
          status.inTransit,
          status.delivered,
        ],
      },
      shippingDetails:{
        type:String,
      }
    },
  ],
  deliveryAddress: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: [
      payment.prepaid,
      payment.cod
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Order", OrderSchema);
