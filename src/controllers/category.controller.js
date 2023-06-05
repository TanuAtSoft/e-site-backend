const Category = require("../models/category.model");
const { sendResponse } = require("../helpers/requestHandlerHelper");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    return sendResponse(res, true, 200, "Products found successfully", {
      categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.addCategories = async (req, res, next) => {
  try {
    const category = new Category({
      name: req.body.name,
    });

    await category.save();
    return sendResponse(res, true, 200, "category added successfully");
  } catch (e) {
    console.log(e);
  }
};

