const { sendResponse } = require("../helpers/requestHandlerHelper");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

exports.addToCart = async (req, res, next) => {
  try {
    const itemExist = await Cart.findOne({
      $and: [
        { buyer: { _id: req.user._id } },
        { productId: req.body.productId },
      ],
    });
    if (itemExist) {
      itemExist.quantity = itemExist.quantity + 1;
      await itemExist.save();
    }

    if (!itemExist) {
      const user = await User.findById({_id: req.user._id})
      const product = await Product.findById({ _id: req.body.productId });
      const newCart = new Cart({
        productId: req.body.productId,
        quantity: 1,
        title: product.title,
        brand: product.brand,
        image: product.images[0],
        price: product.price,
        seller: product.seller,
        buyer: req.user._id,
      });

      await newCart.save();
      await user.cart.push(newCart)
      // const user = await User.findByIdAndUpdate(
      //   { _id: req.user._id },
      //   { $push: { cart: newCart } }
      // );
      await user.save();
    }
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
exports.getCartLength = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    let cartLength;
    if(user.cart){
      cartLength = user.cart.length;
    }
    else{
   cartLength = 0;
    }
    return sendResponse(res, true, 200, "cart details", cartLength);
  } catch (err) {
    return sendResponse(res, false, 401, err);
  }
};

exports.removeItemFromCart = async (req, res) => {
  try {
    const itemExist = await Cart.findOne({
      $and: [
        { buyer: { _id: req.user._id } },
        { productId: req.body.productId },
      ],
    });
    if (itemExist) {
      if (itemExist.quantity === 1) {
        const user = await User.findByIdAndUpdate(
          { _id: req.user._id },
          { $pull: { cart: itemExist._id } }
        );
        await user.save();
        await Cart.findByIdAndRemove({ _id: itemExist._id });
        return sendResponse(res, true, 200, "Item removed successfully");
      }
      if (itemExist.quantity > 1) {
        itemExist.quantity = itemExist.quantity - 1;
        await itemExist.save();
        return sendResponse(res, true, 200, "Item removed successfully");
      }
    }
    if (!itemExist) {
      return sendResponse(res, true, 200, "No item found in the user's cart");
    }
  } catch (err) {
    return sendResponse(res, false, 401, err);
  }
};

exports.deleteItemFromCart = async (req, res) => {
  try {
    const itemExist = await Cart.findOne({
      $and: [
        { buyer: { _id: req.user._id } },
        { productId: req.body.productId },
      ],
    });
    if (itemExist) {
      const user = await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $pull: { cart: itemExist._id } }
      );
      await user.save();
      await Cart.findByIdAndRemove({ _id: itemExist._id });
      return sendResponse(res, true, 200, "Item removed successfully");
    }
  } catch (err) {
    return sendResponse(res, false, 401, err);
  }
};
