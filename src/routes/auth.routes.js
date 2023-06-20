const router = require("express").Router();
const authController = require("../controllers/auth.controllers");
const { authenticated,authorize } = require("../middlewares/authenticated.middleware");


router.post("/register", authController.register);

router.post("/login",authController.login);

router.post(
    "/resetPassword",
    authenticated,
    authController.resetPassword
  );

module.exports = router;
