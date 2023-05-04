const router = require("express").Router();
const orderController = require("../controllers/payment.controller")
const {
    authorize,
    authenticated,
  } = require("../middlewares/authenticated.middleware");


router.post("/createOrder",   authenticated,
authorize(["BUYER"]),orderController.orders);

router.post("/verifypayment",  authenticated,
authorize(["BUYER"]), orderController.verify);

module.exports = router;
