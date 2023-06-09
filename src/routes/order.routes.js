const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const {
  authorize,
  authenticated,
} = require("../middlewares/authenticated.middleware");

router.post(
  "/saveOrder",
  authenticated,
  authorize(["BUYER"]),
  orderController.createOrder
);

router.get("/getOrders", orderController.getAllOrders);

router.get("/getOrderInfo", authenticated, orderController.seller_order_info);

router.patch(
  "/updateOrderStatus",
  authenticated,
  orderController.update_Order_Info
);
router.get(
  "/getBuyerOrderInfo",
  authenticated,
  orderController.buyer_Order_Info
);

router.get(
  "/getSellerMatricsInfo",
  authenticated,
  orderController.seller_metrics_info
);

// router.patch(
//   "/testingOrder",
//   authenticated,
//   authorize(["BUYER"]),
//   orderController.testOrder
// );

module.exports = router;
