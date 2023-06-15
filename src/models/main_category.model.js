const mongoose = require("mongoose");

const MainCategorySchema = mongoose.Schema({
  mainCategory: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("MainCategory", MainCategorySchema);
