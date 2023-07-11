const User = require("../models/user.model");
const { sendResponse } = require("../helpers/requestHandlerHelper");
const { sendEmail, getUserEmailById } = require("../services/emailSender");
const Order = require("../models/order.model");
const mongoose = require("mongoose");
const Product = require("../models/product.model");
const { request } = require("express");

exports.getSeller = async (req, res, next) => {
  try {
    const sellers = await User.aggregate([
      { $match: { role: "SELLER" } },
      {
        $lookup: {
          from: "verificationdocuments",
          localField: "verificationDoc",
          foreignField: "_id",
          as: "verificationDoc",
        },
      },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          email: "$email",
          createdAt: "$createdAt",
          softDelete: "$softDelete",
          verified: "$verified",
          verificationDoc: "$verificationDoc",
        },
      },
    ]);
    // const users = await User.find({ role: "SELLER" });
    return sendResponse(res, true, 200, "Sellers found successfully", {
      sellers,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBuyer = async (req, res, next) => {
  try {
    const buyers = await User.aggregate([
      { $match: { role: "BUYER" } },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          email: "$email",
          createdAt: "$createdAt",
          softDelete: "$softDelete",
          verified: "$verified",
        },
      },
    ]);
    return sendResponse(res, true, 200, "Products found successfully", {
      buyers,
    });
  } catch (error) {
    next(error);
  }
};

exports.blockSeller = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ _id: req.params.id });
    if (userExist) {
      userExist.softDelete = true;
      await userExist.save();
      await Order.updateMany(
        {
          $and: [
            { "orderedItems.seller": req.params.id },
            { "orderedItems.status": { $ne: "DELIVERED" } },
          ],
        },
        {
          $set: {
            "orderedItems.$.status": "CANCELLED",
          },
        },
        {
          multi: true,
        }
      );
      const orders = await Order.aggregate([
        { $unwind: "$orderedItems" },
        {
          $match: {
            $and: [
              {
                "orderedItems.seller": new mongoose.Types.ObjectId(
                  req.params.id
                ),
              },
              { "orderedItems.status": { $ne: "DELIVERED" } },
            ],
          },
        },
      ]);
      for (let i = 0; i < orders.length; i++) {
        const userEmail = await getUserEmailById(orders[i].orderedBy);
        const emailSubjectUser = "Order Cancelled due to unavoidable situation";
        let emailText;
        if (orders[i].paymentStatus === "PREPAID") {
          const amount =
            orders[i].orderedItems?.quantity *
            orders[i].orderedItems?.discountedPrice;
          const product = await Product.findById(
            orders[i].orderedItems?.productId
          );
          product.stock = product.stock + orders[i].orderedItems?.quantity;
          await product.save();

          emailText = `Hello,
        your order of order id ${orders[i].orderId} for the product ${orders[i].orderedItems.title} of brand ${orders[i].orderedItems.brand} has been cancelled 
        due to some un avoidable situations.
         Your ${amount} will be credited in you oroginal account in next 3 working day!!
         We regret the inconvenience caused.
         
         Thanks,
         E-site Mangement Team
       `;
        } else {
          emailText = `Hello,
        your order of order id ${orders[i].orderId} for the product ${orders[i].orderedItems.title} of brand ${orders[i].orderedItems.brand} has been cancelled 
        due to some un avoidable situations.
         We regret the inconvenience caused.
         Thanks,
         E-site Mangement Team
       `;
        }
        await sendEmail(userEmail, emailSubjectUser, emailText);
      }
      const userEmail = userExist.email;
      const emailSubjectUser = "Your Account has been blocked due to ";
      const emailText = `Hello ${userExist.name},
      your account has been banned for not following the e-site guidelines or for the poor quality products 
      or repetetive misleading/false information of the product you are selling.
      Your products will not be listed further in the product selling page, existing orders are cancelled. 

     For further details kindly mail to support@esite.com

      Thanks,
      E-site Mangement Team
     `;
      await sendEmail(userEmail, emailSubjectUser, emailText);
      return sendResponse(
        res,
        true,
        200,
        "Seller has been blocked successfully",
        orders
      );
    } else {
      return sendResponse(res, true, 400, "Seller doesnot exist");
    }
  } catch (error) {
    next(error);
  }
};

exports.getUserInfoById = async (req, res, next) => {
  try {
    const sellers = await User.findById(req.params.id);
    // const users = await User.find({ role: "SELLER" });
    return sendResponse(res, true, 200, "users found successfully", {
      sellers,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user._id,
    });

    if (user.verified)
      return sendResponse(res, true, 200, "User is already verified");
    if (!user.verified) user.verified = true;
    await user.save();
    return sendResponse(res, true, 200, "User is verified successfully");
  } catch (error) {
    next(error);
  }
};

exports.verifySeller = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (user.verified)
      return sendResponse(res, true, 200, "User is already verified");
    if (!user.verified) {
      user.verified = true;
      const userEmail = user.email;
      const emailSubjectUser = "Your Account has been verified";
      const emailText = `Hello ${user.name},
          your account has been successfully verified,
           Kindly Login to your https://e-site-flame.vercel.app/ to see your dashboard and start adding your product and start selling.
            Happy Selling!
            Regards,
            E-site Management`;
      await sendEmail(userEmail, emailSubjectUser, emailText);

      await user.save();
    }
    return sendResponse(res, true, 200, "User is verified successfully");
  } catch (error) {
    next(error);
  }
};
