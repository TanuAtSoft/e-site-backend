const { sendResponse } = require("../helpers/requestHandlerHelper");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
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
      buyerName: req.user.name,
      orderedItems: d,
      deliveryAddress: req.body.deliveryAddress,
      paymentStatus: req.body.isCod ? "COD" : "PREPAID",
    });
    await newOrder.save();

    for (let i = 0; i < d.length; i++) {
      const product = await Product.findById(d[i].productId);
      product.stock = parseInt(product.stock) - parseInt(d[i].quantity);
      await product.save();
    }
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
      // {
      //   $group: {
      //     _id: 0,
      //     items_delivered: {
      //       $sum: "$orderedItems.quantity",
      //     },
      //     revenue_generated: {
      //       $sum: {
      //         $multiply: ["$orderedItems.quantity", "$orderedItems.price"],
      //       },
      //     },
      //   },
      // },
    ]);

    return sendResponse(res, true, 200, "found orders", data);
  } catch (e) {
    return sendResponse(res, false, 400, e);
  }
};

exports.update_review_Info = async (req, res) => {
  try {
    const data = await Order.findOneAndUpdate(
      {
        _id: req.body.orderObjectId,
        "orderedItems._id": req.body.itemId,
      },
      {
        $set: {
          "orderedItems.$.rating": req.body.rating,
        },
      },
      {
        multi: false,
      }
    );
    if (data) {
      const product = await Product.updateOne(
        { _id: req.body.itemId },
        { $push: { ratings: req.body.rating } }
      );
      if (product) {
        await product.save();
      }
    }

    return sendResponse(res, true, 200, "Updated order status successfully");
  } catch (e) {
    return sendResponse(res, false, 401, "Something went wrong");
  }
};

exports.update_Order_Info = async (req, res) => {
  try {
    await Order.findOneAndUpdate(
      {
        _id: req.body.orderObjectId,
        "orderedItems._id": req.body.itemId,
      },
      {
        $set: {
          "orderedItems.$.status": req.body.status,
          "orderedItems.$.shippingDetails": req.body.shippingDetails
            ? req.body.shippingDetails
            : "",
        },
      },
      {
        multi: false,
      }
    );
    return sendResponse(res, true, 200, "Updated order status successfully");
  } catch (e) {
    return sendResponse(res, false, 401, "Something went wrong");
  }
};

exports.buyer_Order_Info = async (req, res) => {
  try {
    const data = await Order.find({
      orderedBy: req.user._id,
    });
    return sendResponse(res, true, 200, "orders found succesfully", data);
  } catch (e) {
    return sendResponse(res, false, 401, "Something went wrong");
  }
};

exports.seller_metrics_info = async (req, res) => {
  try {
    const itemSold = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $match: {
          "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: 0,
          items_sold: {
            $sum: "$orderedItems.quantity",
          },
        },
      },
    ]);
    const ordered = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $match: {
          $and: [
            {
              "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
            },
            { "orderedItems.status": "ORDERED" },
          ],
        },
      },
      {
        $group: {
          _id: 0,
          items_ordered: {
            $sum: "$orderedItems.quantity",
          },
        },
      },
    ]);
    const processed = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $match: {
          $and: [
            {
              "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
            },
            { "orderedItems.status": "INPROCESS" },
          ],
        },
      },
      {
        $group: {
          _id: 0,
          items_processed: {
            $sum: "$orderedItems.quantity",
          },
        },
      },
    ]);
    const shipped = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $match: {
          $and: [
            {
              "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
            },
            { "orderedItems.status": "SHIPPED" },
          ],
        },
      },
      {
        $group: {
          _id: 0,
          items_shipped: {
            $sum: "$orderedItems.quantity",
          },
        },
      },
    ]);
    const transit = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $match: {
          $and: [
            {
              "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
            },
            { "orderedItems.status": "INTRANSIT" },
          ],
        },
      },
      {
        $group: {
          _id: 0,
          items_intransit: {
            $sum: "$orderedItems.quantity",
          },
        },
      },
    ]);
    const delivered = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $match: {
          $and: [
            {
              "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
            },
            { "orderedItems.status": "DELIVERED" },
          ],
        },
      },
      {
        $group: {
          _id: 0,
          items_delivered: {
            $sum: "$orderedItems.quantity",
          },
          revenue_generated: {
            $sum: {
              $multiply: ["$orderedItems.quantity", "$orderedItems.price"],
            },
          },
        },
      },
    ]);
    const data = {
      ordered: ordered.length > 0 ? ordered[0].items_ordered : 0,
      processed: processed.length > 0 ? processed[0].items_processed : 0,
      shipped: shipped.length > 0 ? shipped[0].items_shipped : 0,
      transit: transit.length > 0 ? transit[0].items_intransit : 0,
      delivered: delivered.length > 0 ? delivered[0].items_delivered : 0,
      totalRevenue: delivered.length > 0 ? delivered[0].revenue_generated : 0,
      totalitemsSold: itemSold.length > 0 ? itemSold[0].items_sold : 0,
    };

    return sendResponse(res, true, 200, "found orders", data);
  } catch (e) {
    return sendResponse(res, false, 400, e);
  }
};

exports.seller_stocks_info = async (req, res, next) => {
  try {
    const data = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $match: {
          "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: "$orderedItems.productId",
          title: {
            $first: "$orderedItems.title",
          },
          image: {
            $first: "$orderedItems.image",
          },
          total_items_sold: { $sum: "$orderedItems.quantity" },
        },
      },
    ]);

    return sendResponse(res, true, 200, "found orders", data);
  } catch (e) {
    return sendResponse(res, false, 400, e);
  }
};

exports.seller_revenue_info = async (req, res, next) => {
  try {
    const data = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $match: {
          $and: [
            {
              "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
            },
            { "orderedItems.status": "DELIVERED" },
          ],
        },
      },
      {
        $group: {
          _id: "$orderedItems.productId",
          total_items_sold: { $sum: "$orderedItems.quantity" },
          title: {
            $first: "$orderedItems.title",
          },
          image: {
            $first: "$orderedItems.image",
          },
          revenue_generated: {
            $sum: {
              $multiply: ["$orderedItems.quantity", "$orderedItems.price"],
            },
          },
        },
      },
    ]);
    return sendResponse(res, true, 200, "found orders", data);
  } catch (e) {
    return sendResponse(res, false, 400, e);
  }
};

exports.seller_bestseller_info = async (req, res, next) => {
  try {
    const data = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $match: {
          "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: "$orderedItems.productId",
          title: {
            $first: "$orderedItems.title",
          },
          image: {
            $first: "$orderedItems.image",
          },
          totalSold: {
            $sum: "$orderedItems.quantity",
          },
        },
      },
      {
        $sort: {
          totalSold: -1,
        },
      },
      {
        $limit: 3,
      },
    ]);

    return sendResponse(res, true, 200, "found best seller products", data);
  } catch (e) {
    return sendResponse(res, false, 400, e);
  }
};
