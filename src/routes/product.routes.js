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

router.post(
  "/addProducts",
  authenticated,
  authorize(["SELLER", "ADMIN"]),
  productController.addProduct
);

router.patch(
  "/editProduct/:id",
  authenticated,
  authorize(["SELLER", "ADMIN"]),
  productController.editProduct
);
module.exports = router;
productController.editProduct;

router.get(
  "/getProductByCategory",
  productController.getProductByCategory
);
module.exports = router;
