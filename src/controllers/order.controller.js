const { sendResponse } = require("../helpers/requestHandlerHelper");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model")

exports.order = async (req, res) => {
    try {
        const data = await User.findById(req.user._id);
        const d = data.cart;
        const newOrder = new Order({
            orderId: req.body.orderId,
            orderedBy: req.user._id,
            orderedItems: d,
        });
        await newOrder.save();
        await data.updateOne(
            { $push: { orders: newOrder._id } },
            { multi: true }
        );
        await User.findByIdAndUpdate(req.user._id, {
            $set: { cart: [] },
        });

        const data2 = await Order.find(newOrder._id);
        return sendResponse(res, true, 200, "Product found successfully", {
            data2
        });
    } catch (err) {
        return sendResponse(res, false, 400, err);
    }
};
