const { sendResponse } = require("../helpers/requestHandlerHelper");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");
const { sendEmail, getUserEmailById } = require("../services/emailSender");

exports.createOrder = async (req, res) => {
  try {
    const data = await User.findById(req.user._id).populate("cart");
    const d = data.cart;
    let idsArr = d.map((a) => a._id);
    d.forEach((object) => {
      delete object._id;
    });
    for (let i = 0; i < d.length; i++) {
      const product = await Product.findById(d[i].productId);
      const temp = (product.price / 100) * product.discount;
      const temp2 = product.price - temp;
      d[i].discountedPrice = temp2.toFixed();
      product.stock = parseInt(product.stock) - parseInt(d[i].quantity);
      await product.save();
      await data.save();
    }
    const newOrder = new Order({
      orderId: req.body.orderId,
      orderedBy: req.user._id,
      buyerName: req.user.name,
      orderedItems: d,
      deliveryAddress: req.body.deliveryAddress,
      paymentStatus: req.body.isCod ? "COD" : "PREPAID",
      totalAmountPaid: req.body.totalAmountPaid,
    });
    await newOrder.save();
    await data.updateOne({ $push: { orders: newOrder._id } }, { multi: true });
    await User.findByIdAndUpdate(req.user._id, {
      $set: { cart: [] },
    });
    await Cart.deleteMany({ _id: { $in: idsArr } });

    const data2 = await Order.find(newOrder._id);

    for (const product of d) {
      try {
        const sellerEmail = await getUserEmailById(product.seller); // Await the function call to resolve the Promise

        const emailSubject = "New Order Notification";
        const emailText = `Hello,

        You have received a new order with ID ${newOrder.orderId}.
    
        Product Details:
        - Name: ${product.title}
        - Quantity: ${product.quantity}
    
        Thank you for your business!
    
        Regards,
        E-site Management`;
        // Get user email by user Id

        const userEmail = await getUserEmailById(newOrder.orderedBy);

        // Send email to the user with the list of purchased products
        const emailSubjectUser = "Order Confirmation";
        const emailTextUser = `Hello,

    Thank you for your order! Here are the details of your purchase:

    Order ID: ${newOrder.orderId}

    Products:
    ${d
            .map(
              (product) =>
                `- ${product.title} (Quantity: ${product.quantity}) (Price: ${product.discountedPrice ? product.discountedPrice : product.price
                })`
            )
            .join("\n")}

    Payment Mode: ${newOrder.paymentStatus} 
    Total Amount Paid : ${req.body.totalAmountPaid}

    If you have any questions or need further assistance, please feel free to contact us.

    Regards,
   E-site Service Mangement`;

        await sendEmail(sellerEmail, emailSubject, emailText);
        await sendEmail(userEmail, emailSubjectUser, emailTextUser);
      } catch (error) {
        console.error("Error getting seller email:", error);
        // Handle the error appropriately (e.g., log, throw, or continue with the loop)
      }
    }
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
        { _id: req.body.productId },
        { $push: { reviews: req.body.rating } }
      );
    }

    return sendResponse(res, true, 200, "Updated order status successfully");
  } catch (e) {
    console.log(e);
    return sendResponse(res, false, 401, "Something went wrong");
  }
};

exports.update_Order_Info = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      {
        _id: req.body.orderObjectId,
        "orderedItems._id": req.body.itemId,
      },
      {
        $set: {
          "orderedItems.$.status": req.body.status,
          "orderedItems.$.shippingCompany": req.body.shippingCompany,
          "orderedItems.$.trackingNumber": req.body.trackingNumber,
          "orderedItems.$.updatedAt": Date.now(),
        },
      },
      {
        multi: false,
      }
    );
    if (order) {
      for (let i = 0; i < order.orderedItems.length; i++) {
        if (order.orderedItems[i].productId === req.body.productId) {
          const userEmail = await getUserEmailById(order.orderedBy);
          const emailSubjectUser = "Order Status Change";
          const emailText = `Hello,
            Your order status with order ID ${order.orderId} has changed.
           For Item ${order.orderedItems[i].title}
           of  ${order.orderedItems[i].quantity}
           order status changed to ${req.body.status}
           Payment status for this product is ${order.paymentStatus} of INR ${order.orderedItems[i].discountedPrice *
            order.orderedItems[i].quantity
            }
           Kindly Login to your https://e-site-flame.vercel.app/ to see complete details.
            Thank you for your business!
            Regards,
            E-site Management`;
          await sendEmail(userEmail, emailSubjectUser, emailText);
          return sendResponse(
            res,
            true,
            200,
            "Updated order status successfully"
          );
        }
      }
    }
  } catch (e) {
    console.log("e", e);
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
      // {
      //   $match: {
      //     "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
      //   },
      // },
      {
        $match: {
          $and: [
            {
              "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
            },
            { "orderedItems.status": { $ne: "CANCELLED" } },
          ],
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
        // $match: {
        //   "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
        // },
        $match: {
          $and: [
            {
              "orderedItems.seller": new mongoose.Types.ObjectId(req.user._id),
            },
            { "orderedItems.status": { $ne: "CANCELLED" } },
          ],
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

exports.best_seller_products = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $unwind: "$orderedItems" },
      {
        $group: {
          _id: "$orderedItems.productId",
          title: {
            $first: "$orderedItems.title",
          },
          price: {
            $first: "$orderedItems.price",
          },
          reviews: {
            $first: "$orderedItems.reviews",
          },
          image: {
            $first: "$orderedItems.image",
          },
          brand: {
            $first: "$orderedItems.brand",
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
        $limit: 10,
      },
    ]);

    return sendResponse(res, true, 200, "found orders", data);
  } catch (e) {
    return sendResponse(res, false, 400, e);
  }
};

exports.cancel_Order_Info = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      {
        _id: req.body.orderObjectId,
        "orderedItems.productId": req.body.productId,
      },
      {
        $set: {
          "orderedItems.$.status": "CANCELLED",
          "orderedItems.$.updatedAt": Date.now(),
        },
      },
      {
        multi: false,
      }
    );
    if (order) {
      for (let i = 0; i < order.orderedItems.length; i++) {
        if (order.orderedItems[i].productId === req.body.productId) {
          const userEmail = await getUserEmailById(order.orderedBy);
          const product = await Product.findById(
            req.body.productId
          );
          product.stock = product.stock + order.orderedItems[i].quantity;
          await product.save();
          const sellerEmail = await getUserEmailById(order.orderedItems[i].seller)
          const text =
            order.paymentStatus === "PREPAID"
              ? "your amount will be refunded within 3 working days"
              : "";
          const emailSubjectUser = "Order has been Cancelled";
          const emailText = `Hello,
            Your order with order ID ${order.orderId} has cancelled.
           For Item ${order.orderedItems[i].title}
           of  ${order.orderedItems[i].quantity}
           Payment status for this product is ${order.paymentStatus} of INR ${order.orderedItems[i].discountedPrice *
            order.orderedItems[i].quantity
            }
           ${text}
           Kindly Login to your https://e-site-flame.vercel.app/ to see complete details.
            Thank you for your business!
            Regards,
            E-site Management`;
          const sellerEmailText = `Hello,
            Your order with order ID ${order.orderId} has been cancelled by the buyer.
           For Item ${order.orderedItems[i].title}
           of  ${order.orderedItems[i].quantity}
           Payment status for this product was ${order.paymentStatus} of INR ${order.orderedItems[i].discountedPrice *
            order.orderedItems[i].quantity
            }
           Kindly Login to your https://e-site-flame.vercel.app/ to see complete details.
            Thank you for your business!
            Regards,
            E-site Management`;

          await sendEmail(userEmail, emailSubjectUser, emailText);
          await sendEmail(sellerEmail, emailSubjectUser, sellerEmailText);
          return sendResponse(
            res,
            true,
            200,
            "order cancelled successfully"
          );
        }
      }
    }
  } catch (e) {
    console.log("e", e);
    return sendResponse(res, false, 401, "Something went wrong");
  }
};
