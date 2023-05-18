const { sendResponse } = require("../helpers/requestHandlerHelper");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");

exports.createOrder = async (req, res) => {
  try {
    const data = await User.findById(req.user._id).populate("cart");
    const d = data.cart;
    let idsArr = d.map((a) => a._id);
    d.forEach((object) => {
      delete object._id;
    });
    const newOrder = new Order({
      orderId: req.body.orderId,
      orderedBy: req.user._id,
      orderedItems: d,
      deliveryAddress: req.body.deliveryAddress,
      paymentStatus: req.body.isCod ? "COD":"PREPAID" 
    });
    await newOrder.save();
    await data.updateOne({ $push: { orders: newOrder._id } }, { multi: true });
    await User.findByIdAndUpdate(req.user._id, {
      $set: { cart: [] },
    });
    await Cart.deleteMany({ _id: { $in: idsArr } });

    const data2 = await Order.find(newOrder._id);
    return sendResponse(
      res,
      true,
      200,
      "Your Order has been successfully placed",
      {
        data2,
      }
    );
  } catch (err) {
    return sendResponse(res, false, 400, err);
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const doc = await Order.find();
    return sendResponse(res, true, 200, "all orders", doc);
  } catch (e) {
    console.log("e", e);
  }
};

exports.seller_order_info = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $match: {
          "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
        },
      },
    ]);

    return sendResponse(res, true, 200, "found orders", data);
  } catch (e) {
    return sendResponse(res, false, 400, e);
  }
};

exports.update_Order_Info = async (req,res) =>{
  try{
   await Order.findOneAndUpdate({
      "_id": "6465f4925560ee0a22110e2b", 
      "orderedItems._id": "6465f4635560ee0a22110e1a"  
    },
    {
      $set: {
        "orderedItems.$.status": "ORDERED"
      }
    },
    {
      multi: false
    })
    return sendResponse(res, true, 200, "Updated order status successfully")

  }
  catch(e){
    console.log("e")
  }
}
