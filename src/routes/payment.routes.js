const router = require("express").Router();
const orderController = require("../controllers/payment.controller")
const {
    authorize,
    authenticated,
  } = require("../middlewares/authenticated.middleware");


router.post("/createOrder", authenticated, 
orderController.orders);

router.post("/verifypayment", authenticated, orderController.verify);

module.exports = router;
