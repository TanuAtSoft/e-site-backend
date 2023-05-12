const { sendResponse } = require("../helpers/requestHandlerHelper");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model")
const mongoose = require("mongoose")

exports.order = async (req, res) => {
    try {
        const data = await User.findById(req.user._id).populate("cart");
        const d = data.cart;
        let idsArr = d.map(a => a._id);
        d.forEach(object => {
            delete object['_id'];
        });
        const newOrder = new Order({
            orderId: req.body.orderId,
            orderedBy: req.user._id,
            orderedItems: d,
            deliveryAddress: req.body.deliveryAddress
        });
        await newOrder.save();
        await data.updateOne(
            { $push: { orders: newOrder._id } },
            { multi: true }
        );
        await User.findByIdAndUpdate(req.user._id, {
            $set: { cart: [] },
        });
        await Cart.deleteMany({ _id: { $in: idsArr } })

        const data2 = await Order.find(newOrder._id);
        return sendResponse(res, true, 200, "Your Order has been successfully placed", {
            data2
        });
    } catch (err) {
        return sendResponse(res, false, 400, err);
    }
};
exports.getAllOrders = async (req, res) => {
    try {
        const doc = await Order.find()
        return sendResponse(res, true, 200, "yes", doc);

        // do stuff with docs


        //    const data = await Order.find({orderedItems: {
        //         $elemMatch: {
        //           seller: "643ff24d6370aa18d6a4135a",

        //         }
        //       }})
        // .populate({ 
        //     path: 'orderedItems',
        //     populate: {
        //       path: 'seller',
        //     } 
        //  })



    }
    catch (e) {
        console.log("e", e)
    }
}

exports.seller_order_info = async (req, res) => {
    //{EmployeeDetails:{$elemMatch:{EmployeePerformanceArea : "C++", Year : 1998}}}
    try {
        const data = await Order.find({ orderedItems: { $elemMatch: { seller: req.user._id } } })
        // const allData = await Order.find()
        // const data = await Order.aggregate([
        //     {
        //       $project: {
        //         _id: 1,
        //         orderId: 1,
        //         orderedBy: 1,
        //         deliveryAddress: 1,
        //         status: 1,
        //         createdAt: 1,
        //         updateAt: 1,
        //         orderedItems: {
        //           $filter: {
        //             input: "$orderedItems",
        //             as: "items",
        //             cond: {
        //               $in: [
        //                 "$$items.seller",
        //                 [
        //                     "643d38a46102ca00170416b2"
        //                 ]
        //               ]
        //             }
        //           }
        //         }
        //       }
        //     }
        //   ])
        const arrayData = data
        const filterBySeller = new Set(req.user._id.toString());
        const result = arrayData.filter((o) =>
            o.orderedItems.map((item)=> {if(item.seller === req.user._id.toString) return item})
        );
      
        console.log("filteredArr", result);
        console.log("data", data)
        return sendResponse(res, true, 200, "found orders", result);

    }
    catch (e) {
        return sendResponse(res, false, 400, e);
    }
}
