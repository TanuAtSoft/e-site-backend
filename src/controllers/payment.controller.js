const Razorpay = require("razorpay");
const crypto = require("crypto");
const { sendResponse } = require("../helpers/requestHandlerHelper");

exports.orders=  async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: process.env.RAZOR_PAY_KEY_ID,
			key_secret: process.env.RAZOR_PAY_SECRET_KEY,
		});

		const options = {
			//amount: 2000,
            amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				return sendResponse(res, false, 500, "something went wrong", {
					error
				});
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		return sendResponse(res, false, 500, "internal server error", {
			error
		});
	}
}

exports.verify= async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.RAZOR_PAY_SECRET_KEY)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			const data ={orderId: razorpay_order_id}
			 return sendResponse(res, true, 200, "payment verified successfully",data);
		} else {
			return sendResponse(res, false, 400, "Invalid Signature sent");
		}
	} catch (error) {
	  return	sendResponse(res, false, 500, "internal server error", {
			error
		});
		
	}
}