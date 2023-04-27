const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  quantity:{
    type: Number
  },
  items:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }

});

module.exports = mongoose.model("Cart", CartSchema);