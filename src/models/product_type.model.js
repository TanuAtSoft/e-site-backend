const mongoose = require("mongoose");

const ProductTypeSchema = mongoose.Schema({
  productType: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("ProductType", ProductTypeSchema);