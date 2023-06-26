const User = require("../models/user.model");
const { sendResponse } = require("../helpers/requestHandlerHelper");

exports.getSeller = async (req, res, next) => {
    try {
      const users = await User.find({ role : "SELLER" })
      return sendResponse(res, true, 200, "Products found successfully", {
        users,
      });
    } catch (error) {
      next(error);
    }
  };

  exports.getBuyer = async (req, res, next) => {
    try {
      const users = await User.find({ role : "BUYER" })
      return sendResponse(res, true, 200, "Products found successfully", {
        users,
      });
    } catch (error) {
      next(error);
    }
  }