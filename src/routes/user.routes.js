const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  authorize,
  authenticated,
} = require("../middlewares/authenticated.middleware");

router.get(
  "/getSeller",
  authenticated,
  authorize("ADMIN"),
  userController.getSeller
);

router.get(
  "/getBuyers",
  authenticated,
  authorize("ADMIN"),
  userController.getBuyer
);

router.patch(
  "/blockSeller/:id",
  authenticated,
  authorize("ADMIN"),
  userController.blockSeller
);

router.get(
  "/userInfo/:id",
  authenticated,
  userController.getUserInfoById
);

router.patch(
  "/verifyUser",
  authenticated,
  authorize("BUYER"),
  userController.verifyUser
);
router.patch(
  "/verifySeller/:id",
  authenticated,
  authorize("ADMIN"),
  userController.verifySeller
);


module.exports = router;
