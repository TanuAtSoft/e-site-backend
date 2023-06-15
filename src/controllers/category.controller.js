const MainCategory = require("../models/main_category.model");
const SubCategory = require("../models/sub_category.model");
const { sendResponse } = require("../helpers/requestHandlerHelper");

exports.getMainCategories = async (req, res, next) => {
  try {
    const mainCategories = await MainCategory.find();

    return sendResponse(res, true, 200, "Products found successfully", {
      mainCategories,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubCategories = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.find();

    return sendResponse(res, true, 200, "Products found successfully", {
      subCategories,
    });
  } catch (error) {
    next(error);
  }
};

exports.addMainCategories = async (req, res, next) => {
  try {
    const mainCategory = new MainCategory({
      mainCategory: req.body.mainCategory,
      //subCategory:req.body.subCategory?req.body.subCategory:null
    });

    await mainCategory.save();
    return sendResponse(res, true, 200, "category added successfully");
  } catch (e) {
    console.log(e);
  }
};

exports.addSubCategories = async (req, res, next) => {
  try {
    const subCategory = new SubCategory({
      subCategory: req.body.subCategory,
    });

    await subCategory.save();
    return sendResponse(res, true, 200, "category added successfully");
  } catch (e) {
    console.log(e);
  }
};

