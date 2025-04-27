const aiFlowService = require("../services/aiflow.service");

exports.streamChat = async (req, res, next) => {
  try {
    const { message, customPrompt = "", sessionId } = req.body.data;
    await aiFlowService.streamFromAIFlow(message, customPrompt, sessionId, res);
  } catch (err) {
    next(err);
  }
};
