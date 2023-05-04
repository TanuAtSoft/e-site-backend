const router = require("express").Router();
const orderController = require("../controllers/order.controller")
const {
    authorize,
    authenticated,
} = require("../middlewares/authenticated.middleware");


router.post("/saveOrder", authenticated,
    authorize(["BUYER"]), orderController.order);


module.exports = router;
