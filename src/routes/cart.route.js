const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const {addToCartValidator,removeItemFromCartValidator} = require ( "../validators/cart.validators")

const {
  authorize,
  authenticated,
} = require("../middlewares/authenticated.middleware");

router.patch(
  "/addToCart",
  addToCartValidator,
  authenticated,
  authorize(["BUYER"]),
  cartController.addToCart
);

router.get(
  "/getCart",
  authenticated,
  authorize(["BUYER"]),
  cartController.getCart
);
router.get(
  "/getCartLength",
  authenticated,
  authorize(["BUYER"]),
  cartController.getCartLength
);

router.put(
  "/deleteCartItem",
  removeItemFromCartValidator,
  authenticated,
  authorize(["BUYER"]),
  cartController.removeItemFromCart
);

router.delete(
  "/deleteItemFromCart",
  removeItemFromCartValidator,
  authenticated,
  authorize(["BUYER"]),
  cartController.deleteItemFromCart
);

module.exports = router;
