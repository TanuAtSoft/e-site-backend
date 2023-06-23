const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const {
  authenticated,
} = require("../middlewares/authenticated.middleware");

const {mainCategoryValidator,subCategoryValidator} = require("../validators/category.validators")

router.get(
    "/getMainCategory",
    categoryController.getMainCategories
  );

  router.get(
    "/getSubCategory",
    categoryController.getSubCategories
  );

  router.post(
    "/addMainCategory",
    mainCategoryValidator,
    // authenticated,
    categoryController.addMainCategories
  );

  router.post(
    "/addSubCategory",
    subCategoryValidator,
    // authenticated,
    categoryController.addSubCategories
  );


  module.exports = router;
  
  