const { sendResponse } = require("../helpers/requestHandlerHelper");
const User = require("../models/user.model");
const Product = require("../models/product.model");

exports.addToCart = async (req, res, next) => {
  try {
    //const ifItemExist =  await User.findById(  { _id: req.user._id })
    const data = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $push: { cart: req.body.productId } }
    );
    // data.cart.push(req.body.productId)
    console.log("data", data.cart);
    return sendResponse(res, true, 200, "product added to cart");
  } catch (err) {
    return sendResponse(res, false, 401, err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.user._id }).populate("cart");
    //console.log("req.user", user);
    const cartDetails = user.cart;
    //console.log("cartDetails", cartDetails);
    // try {
    //   let cartArr = await Product.findById("643fe2296370aa18d6a41339").populate("seller",
    //     "name"
    //   );
    //   console.log("cartArr", cartArr);
    // } catch (e) {
    //   console.log("inside try", e);
    // }

    return sendResponse(res, true, 200, "cart details", cartDetails);
  } catch (err) {
    return sendResponse(res, false, 401, err);
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $pull: { cart: req.body.productId } }
    );
    return sendResponse(res, true, 200, "cart details", data.cart);
  } catch (err) {
    return sendResponse(res, false, 400, "something went wrong", err);
  }
};
