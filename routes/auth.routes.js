const router = require("express").Router();
const User = require("../models/user.model");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../helpers/requestHandlerHelper");
const { roles } = require("../utils/constants");

router.post("/register", async (req, res) => {
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
});

router.post("/login", async (req, res) => {
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
          },
          process.env.ACCESS_TOKEN_SECRET
        );
        const user = {
          id: userExist._id,
          user: userExist.email,
          token: accessToken,
          role: userExist.role,
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
});

module.exports = router;
