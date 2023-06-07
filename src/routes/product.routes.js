const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const {
  authorize,
  authenticated,
} = require("../middlewares/authenticated.middleware");

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
router.delete(
  "/deleteProduct/:id",
  authenticated,
  authorize(["SELLER", "ADMIN"]),
  productController.deleteSingleProduct
);
router.get("/getProductByCategory", productController.getProductByCategory);
router.get(
  "/getProductByUser",
  authenticated,
  authorize(["SELLER", "ADMIN"]),
  productController.getProductsByUser
);
module.exports = router;
