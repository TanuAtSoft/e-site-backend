const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const {
  authorize,
  authenticated,
} = require("../middlewares/authenticated.middleware");
const {
  createOrderValidator,
  updateOrderReviewValidator,
  updateOrderInfoValidator
} = require("../validators/order.validator")

router.post(
  "/saveOrder",
  createOrderValidator,
  authenticated,
  authorize(["BUYER"]),
  orderController.createOrder
);

router.get("/getOrders", orderController.getAllOrders);

router.get("/getOrderInfo", authenticated, orderController.seller_order_info);

router.patch(
  "/updateOrderStatus",
  updateOrderInfoValidator,
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
  authorize(["SELLER","ADMIN"]),
  orderController.seller_metrics_info
);

router.get(
  "/sellerStocksInfo",
  authenticated,
  authorize(["SELLER","ADMIN"]),
  orderController.seller_stocks_info
);

router.get(
  "/sellerRevenueInfo",
  authenticated,
  authorize(["SELLER","ADMIN"]),
  orderController.seller_revenue_info
);

router.get(
  "/sellerBestSellerInfo",
  authenticated,
  authorize(["SELLER","ADMIN"]),
  orderController.seller_bestseller_info
);

router.patch(
  "/reviewProduct",
  updateOrderReviewValidator,
  authenticated,
  authorize(["BUYER"]),
  orderController.update_review_Info
);

router.get("/bestSeller", orderController.best_seller_products);

module.exports = router;
