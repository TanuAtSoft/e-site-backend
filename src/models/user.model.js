const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var createError = require("http-errors");
const { roles } = require("../utils/userEnum");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  verified:{
   type:Boolean,
   default: false,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false 
  },
  role: {
    type: String,
    enum: [roles.admin, roles.buyer, roles.seller],
    default: roles.buyer,
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  softDelete:{
    type:Boolean,
    default:false
  },
  verificationDoc: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "VerificationDocument",
  },
});

// UserSchema.pre('save', async function (next) {
//   try {
//     if (this.isNew) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(this.password, salt);
//       this.password = hashedPassword;
//       if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
//         this.role = roles.admin;
//       }
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw next(createError(401, "password doesnot match"));
  }
};

module.exports = mongoose.model("User", UserSchema);
