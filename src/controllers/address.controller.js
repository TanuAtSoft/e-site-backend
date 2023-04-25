const User = require("../models/user.model");
const Address = require("../models/address.model");
const { sendResponse } = require("../helpers/requestHandlerHelper");

exports.addAdress = async (req, res, next) => {
    try {
        const address = new Address({
            fullName: req.body.fullName,
            mobileNumber: req.body.mobileNumber,
            pincode:req.body.pincode,
            houseNumber:req.body.houseNumber,
            area:req.body.area,
            landmark:req.body.landmark,
            city:req.body.city,
            state:req.body.state,
            user: req.user._id
        })
        await address.save()

      const data = await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $addToSet: { address: address._id } }
      );
    //   console.log("data", data)
      return sendResponse(res, true, 200, "added address");
    } catch (err) {
      return sendResponse(res, false, 401, err);
    }
  };

  exports.getAddress = async (req, res, next) => {
    try {
      const user = await User.findById({ _id: req.user._id }).populate("address");
      const addressDetails = user.address;
      return sendResponse(res, true, 200, "address details", addressDetails);
    } catch (err) {
      return sendResponse(res, false, 401, err);
    }
  };
