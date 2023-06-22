const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../helpers/requestHandlerHelper");
const { roles } = require("../utils/userEnum");
const { sendEmail } = require("../services/emailSender");

exports.register = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const userExist = await User.findOne({
      email: req.body.email,
    }).exec();
    if (userExist) {
      return sendResponse(res, false, 400, "email already exists");
    }
    if (!userExist) {
      if (req.body.isSeller) {
        const user = new User({
          name: req.body.firstName + " " + req.body.lastName,
          email: req.body.email,
          password: hashedPassword,
          role: roles.seller,
        });

        await user.save();
        return sendResponse(res, true, 200, "user registered successfully");
      }
    }
    if (!req.body.isSeller) {
      const user = new User({
        name: req.body.firstName + " " + req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: roles.buyer,
      });

      await user.save();
      return sendResponse(res, true, 200, "user registered successfully");
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
};

exports.login = async (req, res) => {
  const userExist = await User.findOne({
    email: req.body.email,
  }).exec();
  if (userExist) {
    try {
      if (await bcrypt.compare(req.body.password, userExist.password)) {
        const accessToken = jwt.sign(
          {
            email: userExist.email,
            _id: userExist._id,
            role: userExist.role,
            name: userExist.name,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        const user = {
          user: userExist.name,
          token: accessToken,
          role: userExist.role,
          cart: userExist.cart.length,
          address: userExist.address.length,
          wishlist: userExist.wishlist.length,
        };

        return sendResponse(
          // res.cookie("access_token", accessToken, {
          //   httpOnly: true,
          //   secure: process.env.NODE_ENV === "production",
          // }),
          res,
          true,
          200,
          "logged in successfully",
          { user }
        );
      } else {
        return sendResponse(res, false, 401, "wrong password");
      }
    } catch (e) {
      console.log("e", e);
      return res.send("something went wrong");
    }
  }
  if (!userExist) {
    return sendResponse(res, false, 401, "user does not exist");
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ _id: req.user._id });
    if (userExist === null) {
      return sendResponse(res, true, 400, "Invalid Token");
    }

    if (await bcrypt.compare(req.body.oldPassword, userExist.password)) {
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      await User.findByIdAndUpdate(req.user._id, {
        password: hashedPassword,
      });

      return sendResponse(res, true, 200, "Password Changed Sucessfully");
    } else {
      return sendResponse(res, true, 200, "Old Password doesn't match");
    }
    // compare the current time and resetPasswordExpTime
    // if (moment().unix() < user.resetPasswordExpTime) {

    // }
    // return sendResponse(res, true, 200, "Password Reset Link Expired");
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist === null) {
      return sendResponse(res, true, 400, "user doesnot exist");
    }

    if (userExist) {
      const accessToken = jwt.sign(
        {
          email: userExist.email,
          _id: userExist._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "300s" }
      );

      const userEmail = userExist.email; // Await the function call to resolve the Promise
      const emailSubject = "Password Reset Link";
      const emailText = `Hello ${userExist.name},

        Kindly click the link below to reset your password.

        ${process.env.FORGOT_PASSWORD_LINK}/${accessToken}
    
        Regards,
        E-site Management`;

      await sendEmail(userEmail, emailSubject, emailText);
      return sendResponse(
        res,
        true,
        200,
        "Password reset link sent to your email id"
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPasswordRequest = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ _id: req.user._id });
    if (userExist === null) {
      return sendResponse(res, true, 400, "Invalid Token");
    }
    if(userExist){
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      await User.findByIdAndUpdate(req.user._id, {
        password: hashedPassword,
      });
      return sendResponse(res, true, 200, "Password has been Reset Successfully");
    }
  } catch (e) {
    console.log("e", e);
  }
};
