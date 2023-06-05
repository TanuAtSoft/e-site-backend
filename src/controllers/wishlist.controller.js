const { sendResponse } = require("../helpers/requestHandlerHelper");
const User = require("../models/user.model");

exports.updateWishlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $addToSet: { wishlist: req.body.productId } }
    );
    return sendResponse(
      res,
      true,
      200,
      "product added to wishlist successfully"
    );
  } catch (err) {
    return sendResponse(res, false, 400, err.message);
  }
};

//remove on element from cart
exports.deleteWishlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { wishlist: {_id:req.body.productId }} }
    );
    return sendResponse(
      res,
      true,
      200,
      "product removed from wishlist successfully"
    );
  } catch (err) {
    return sendResponse(res, false, 400, err.message);
  }
};

exports.getWishlist = async (req, res) => {
  try {
   const data = await User.findById({ _id: req.user._id }).populate("wishlist");
   const widhlistData = data.wishlist
    return sendResponse(res, true, 200, "wishlist found successfully",widhlistData);
  } catch (err) {
    return sendResponse(res, false, 400, err.message);
  }
};
