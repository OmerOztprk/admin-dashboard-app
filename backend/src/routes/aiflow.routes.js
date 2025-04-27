const express = require("express");
const router = express.Router();
const aiFlowController = require("../controllers/aiflow.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { streamChatSchema } = require("../validators/aiflow.validator");

router.use(auth.authenticate());

router.post("/chat", auth.checkRoles("aiflow_chat"), validate(streamChatSchema), aiFlowController.streamChat);

module.exports = router;
