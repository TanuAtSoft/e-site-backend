const VerificationDocument = require("../models/verificationDocument.model");
const { sendResponse } = require("../helpers/requestHandlerHelper");
const User = require("../models/user.model");

exports.addDocument = async (req, res, next) => {
  const doc = new VerificationDocument({
    gstNumber: req.body.gstNumber,
    gstDoc: req.body.gstDoc,
    idNumber: req.body.idNumber,
    idProof: req.body.idProof,
    addressProofId: req.body.addressProofId,
    addressProof: req.body.addressProof,
    uploadedBy: req.user._id,
  });
  await doc.save();
//   console.log("doc", doc);
  const user = await User.findById(req.user._id);
  user.verificationDoc = doc._id;
  await user.save();
  return sendResponse(res, true, 200, "document uploaded successfully");
};
