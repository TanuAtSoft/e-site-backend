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
  authorize("admin"),
  userController.getSeller
);

router.get(
  "/getBuyer",
  authenticated,
  authorize("admin"),
  userController.getBuyer
);

module.exports = router;
