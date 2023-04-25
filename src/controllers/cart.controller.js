const { sendResponse } = require("../helpers/requestHandlerHelper");
const User = require("../models/user.model");

exports.addToCart = async (req, res, next) => {
  try {
    const data = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $addToSet: { cart: req.body.productId } }
    );
    return sendResponse(res, true, 200, "product added to cart");
  } catch (err) {
    return sendResponse(res, false, 401, err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.user._id }).populate("cart");
    const cartDetails = user.cart;
    return sendResponse(res, true, 200, "cart details", cartDetails);
  } catch (err) {
    return sendResponse(res, false, 401, err);
  }
};
