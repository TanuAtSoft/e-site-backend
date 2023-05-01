const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");
const { authenticated } = require("../middlewares/authenticated.middleware");

router.post(
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
