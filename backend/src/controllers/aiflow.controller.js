const aiFlowService = require("../services/aiflow.service");

exports.streamChat = async (req, res, next) => {
    try {
        const { message, custom_prompt = '' } = req.body;

        if (!message || typeof message !== "string") {
            const error = new Error("Mesaj alanı zorunludur ve metin olmalıdır.");
            error.statusCode = 400;
            throw error;
        }

        await aiFlowService.streamFromAIFlow(message, custom_prompt, res);
    } catch (error) {
        next(error);
    }
};
