const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const {
  authenticated,
} = require("../middlewares/authenticated.middleware");

router.get(
    "/getCategory",
    categoryController.getCategories
  );

  router.post(
    "/addCategory",
    authenticated,
    categoryController.addCategories
  );
  module.exports = router;
  
  