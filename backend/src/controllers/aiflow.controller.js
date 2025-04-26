const aiFlowService = require("../services/aiflow.service");

exports.streamChat = async (req, res, next) => {
  try {
    const { data } = req.body;

    if (!data) {
      const error = new Error("Eksik veri: 'data' nesnesi bulunamadı.");
      error.statusCode = 400;
      throw error;
    }

    const { message: userMessage, customPrompt = '', sessionId } = data;

    if (!userMessage || typeof userMessage !== "string") {
      const error = new Error("Mesaj alanı zorunludur ve metin olmalıdır.");
      error.statusCode = 400;
      throw error;
    }

    await aiFlowService.streamFromAIFlow(userMessage, customPrompt, sessionId, res);
  } catch (error) {
    next(error);
  }
};
