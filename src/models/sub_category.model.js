const mongoose = require("mongoose");

const SubCategorySchema = mongoose.Schema({
  subCategory: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

module.exports = mongoose.model("SubCategory", SubCategorySchema);