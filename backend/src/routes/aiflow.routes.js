const express = require("express");
const router = express.Router();
const aiFlowController = require("../controllers/aiflow.controller");
const auth = require("../middlewares/auth.middleware");


// 🎯 AI ile sohbet başlatma
router.post("/chat", aiFlowController.streamChat);

module.exports = router;
