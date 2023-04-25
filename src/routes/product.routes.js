const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const {
  authorize,
  authenticated,
} = require("../middlewares/authenticated.middleware");
const { sendResponse } = require("../helpers/requestHandlerHelper");

router.get("/products", productController.getProducts);

router.get("/product/:id", productController.getSingleProduct);

router.patch(
  "/addProducts",
  authenticated,
  authorize(["SELLER", "ADMIN"]),
  productController.addProduct
);
module.exports = router;
