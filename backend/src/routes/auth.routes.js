const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { loginSchema, registerSchema, verifyCodeSchema } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");

// Giriş ve Kayıt
router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.register);

// 2FA kod doğrulama
router.post("/verify-code", validate(verifyCodeSchema), authController.verifyCode);

module.exports = router;
