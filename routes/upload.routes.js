const express = require("express");
const router = express.Router();

const S3 = require("aws-sdk/clients/s3");
const moment = require("moment");
const { sendResponse } = require("../helpers/requestHandlerHelper");
const { upload } = require("../utils/imageUpload");
const {
  S3_ACCESS_KEY,
  S3_BUCKET_REGION,
  S3_BUCKET,
  S3_SECRET_ACCESS_KEY,
} = require("../utils/s3.constants");
const {
  authenticated,
  authorize,
} = require("../middlewares/authenticated.middleware");

const configs = {
  bucketName: S3_BUCKET,
  accessKey: S3_ACCESS_KEY,
  secretKey: S3_SECRET_ACCESS_KEY,
  region: S3_BUCKET_REGION,
};

router.post("/upload/image", upload.single("image"), async (req, res, next) => {
  console.log("req.file", req.file);
  try {
    const { originalname, extension, contentType,location } = req.file;
    const s3 = new S3({
      credentials: {
        accessKeyId: configs.accessKey,
        secretAccessKey: configs.secretKey,
      },
    });
    const params = {
      Bucket: S3_BUCKET,
      Key: `public/images/${moment().unix()}-${originalname}`,
      Expires: 300, //s - 5mins
      ContentType: contentType,
    };
    s3.getSignedUrl('putObject', params, async function(err, url) {
        if (err) {
            throw (err)
        }
        return await sendResponse(res, true, 200, "presinged url", {
           location,
          });
    })
  } catch (error) {
    console.log("error", error);
    next(error);
  }
});

router.post(
  "/upload/images",
  upload.array("images", 10),
  async (req, res, next) => {
    console.log("req.file", req.files);
    try {
        let uploadedImageUrl=[]
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const { originalname, extension, contentType,location } = req.files[i];
          const s3 = new S3({
            credentials: {
              accessKeyId: configs.accessKey,
              secretAccessKey: configs.secretKey,
            },
          });
          console.log("extension", extension)
          const params = {
            Bucket: S3_BUCKET,
            Key: `public/images/${moment().unix()}-${originalname}`,
            Expires: 300, //s - 5mins
            ContentType: contentType,
          };
       
          const url = await s3.getSignedUrl("putObject", params);
         if(location){
          uploadedImageUrl.push(location)
         }
         console.log("uploadImageUrl", uploadedImageUrl)
        }
        if(uploadedImageUrl.length === req.files.length)
        return sendResponse(res, true, 200, "presinged url", {
            uploadedImageUrl,
          }); 
        
      }
    } catch (error) {
      console.log("error", error);
      next(error);
    }
  }
);

module.exports = router;
