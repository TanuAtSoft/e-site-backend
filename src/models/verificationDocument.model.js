const mongoose = require("mongoose")

const VerificationDocumentSchema = new mongoose.Schema({
  gstNumber:{
    type:String,
    required: true
  },
  gstDoc:[{
    type:String,
    required: true
  }],
  idNumber:{
    type:String,
    required: true
  },
  idProof:[{
    type:String,
    required: true
  }],
  addressProofId:{
    type:String,
    required: true
  },
  addressProof:[{
    type:String,
    required: true
  }],
  uploadedBy:{
    type:String,
    required: true
  }
});

module.exports = mongoose.model("VerificationDocument", VerificationDocumentSchema);