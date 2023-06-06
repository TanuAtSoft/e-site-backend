const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const {
  authenticated, authorize,
} = require("../middlewares/authenticated.middleware");

router.get(
    "/getWishlist",
    authenticated,
    authorize(["BUYER"]),
    wishlistController.getWishlist
  );

  router.get(
    "/getWishlistLength",
    authenticated,
    authorize(["BUYER"]),
    wishlistController.getWishlistLength
  );

  router.patch(
    "/addWishlist",
    authenticated,
    authorize(["BUYER"]),
    wishlistController.updateWishlist
  );

  router.patch(
    "/deleteWishlist",
    authenticated,
    authorize(["BUYER"]),
    wishlistController.deleteWishlist
  );

  module.exports = router;