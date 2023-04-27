const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  Quantity:{
    type: Number
  },
  Items:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

});

module.exports = mongoose.model("Cart", CartSchema);