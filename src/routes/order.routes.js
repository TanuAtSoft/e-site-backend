const router = require("express").Router();
const orderController = require("../controllers/order.controller")
const {
    authorize,
    authenticated,
} = require("../middlewares/authenticated.middleware");


router.post("/saveOrder", authenticated,
    authorize(["BUYER"]), orderController.order);
    
    router.get("/getOrders",orderController.getAllOrders)

router.get("/getOrderInfo", authenticated, orderController.seller_order_info)


module.exports = router;
