const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const {
  authenticated,
} = require("../middlewares/authenticated.middleware");

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
    // authenticated,
    categoryController.addMainCategories
  );

  router.post(
    "/addSubCategory",
    // authenticated,
    categoryController.addSubCategories
  );


  module.exports = router;
  
  