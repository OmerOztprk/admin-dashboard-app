const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Giriş ve Kayıt
router.post("/login", authController.login);
router.post("/register", authController.register);

// 2FA kod doğrulama
router.post("/verify-code", authController.verifyCode);

module.exports = router;
