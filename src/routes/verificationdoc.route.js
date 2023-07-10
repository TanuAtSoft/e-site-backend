const express = require("express");
const router = express.Router();
const uploadVerification = require("../controllers/uploadVerification.controller");
const {
  authorize,
  authenticated,
} = require("../middlewares/authenticated.middleware");

router.post(
  "/uploadSellerVerificationDoc",
  authenticated,
  authorize("SELLER"),
  uploadVerification.addDocument
);
module.exports = router;