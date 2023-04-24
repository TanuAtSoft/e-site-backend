const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const {
  authorize,
  authenticated,
} = require("../middlewares/authenticated.middleware");
const { sendResponse } = require("../helpers/requestHandlerHelper");

router.get("/products", async (req, res, next) => {
  try {
    const products = await Product.find()

    return sendResponse(res, true, 200, "Products found successfully", {
      products
    });
  } catch (error) {
    next(error);
  }
});


router.get("/product/:id", async (req, res, next) => {
  console.log("req.params.id",req.params.id)

  try {
    const product = await Product.findById(req.params.id) 

    return sendResponse(res, true, 200, "Product found successfully", {
      product
    });
  } catch (error) {
    next(error);
  }
});


router.post(
  "/addProducts",
  authenticated,
  authorize(["SELLER", "ADMIN"]),
  async (req, res, next) => {
    const product = new Product({
      title: req.body.title,
      brand: req.body.brand,
      category: req.body.category,
      images: req.body.images,
      description: req.body.description,
      price: req.body.price,
      seller: req.user._id,
    });

    await product.save();
    return sendResponse(res, true, 200, "product added successfully");
  }
);
module.exports = router;
