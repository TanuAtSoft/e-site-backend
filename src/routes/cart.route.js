const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const {
  authorize,
  authenticated,
} = require("../middlewares/authenticated.middleware");

router.patch(
  "/addToCart",
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

router.put(
  "/deleteCartItem",
  authenticated,
  authorize(["BUYER"]),
  cartController.deleteCart
);

module.exports = router;
