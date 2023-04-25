const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");
const { authenticated } = require("../middlewares/authenticated.middleware");

router.patch(
  "/addAddress",
  authenticated,
  addressController.addAdress
);

router.get(
    "/getAddress",
    authenticated,
    addressController.getAddress
  );

module.exports = router;
