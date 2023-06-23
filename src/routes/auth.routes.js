const router = require("express").Router();
const authController = require("../controllers/auth.controllers");
const {
  authenticated,
  authorize,
} = require("../middlewares/authenticated.middleware");
const {
  loginValidation,
  registerValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  changePasswordRequestValidation
} = require("../validators/auth.validators");

router.post("/register", registerValidation, authController.register);

router.post("/login", loginValidation, authController.login);

router.post("/resetPassword", changePasswordValidation, authenticated, authController.resetPassword);

router.post("/forgotPassword",forgotPasswordValidation, authController.forgotPassword);
router.post(
  "/resetPasswordRequest",
  changePasswordRequestValidation,
  authenticated,
  authController.resetPasswordRequest
);

module.exports = router;
