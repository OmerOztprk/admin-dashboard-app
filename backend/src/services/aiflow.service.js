const axios = require("axios");
const config = require("../config");

const AIFLOW_URL = config.AIFLOW_URL;

if (!AIFLOW_URL) {
  console.error("⚠️ AIFLOW_URL .env dosyasında tanımlı değil.");
  process.exit(1);
}

exports.streamFromAIFlow = async (userMessage, customPrompt, sessionId, res) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log("📤 AIFlow'a istek gönderiliyor:", { userMessage, customPrompt, sessionId });

    const response = await axios({
      method: "post",
      url: AIFLOW_URL,
      data: {
        data: {
          message: userMessage,
          customPrompt,
          sessionId,
        },
      },
      headers: { "Content-Type": "application/json" },
      responseType: "stream",
    });

    response.data.on("data", (chunk) => {
      if (res.writableEnded) return; // Bağlantı kapandıysa yazma
      const text = chunk.toString();

      if (text.trim().startsWith("data:")) {
        const streamChunks = text.split("\n\n").filter(Boolean);
        for (const chunk of streamChunks) {
          res.write(chunk + "\n\n");
        }
      }
    });

    response.data.on("end", () => {
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
    });

    response.data.on("error", (err) => {
      console.error("❌ Stream sırasında hata:", err);
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ error: "Akış sırasında bir hata oluştu." })}\n\n`);
        res.end();
      }
    });

  } catch (error) {
    console.error("❌ AIFlow bağlantı hatası:", error.message);
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: "AIFlow'a bağlanırken hata oluştu." })}\n\n`);
      res.end();
    }
  }
};
