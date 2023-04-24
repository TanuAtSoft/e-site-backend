const express = require("express");
const router = express.Router();
const { upload } = require("../utils/imageUpload");
const uploadController = require("../controllers/upload.controller")

router.post("/upload/image", uploadController.singleUploader);

router.post("/upload/images", upload.array("images", 10), uploadController.multiUploader);

module.exports = router;
