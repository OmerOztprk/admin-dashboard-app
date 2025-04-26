const axios = require("axios");

const AIFLOW_URL = process.env.AIFLOW_URL;

if (!AIFLOW_URL) {
  console.error("⚠️ AIFLOW_URL .env dosyasında tanımlı değil.");
  process.exit(1);
}

exports.streamFromAIFlow = async (userMessage, customPrompt, sessionId, res) => {
    try {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
  
      console.log("AIFlow'a gönderilen istek:", { userMessage, customPrompt, sessionId });
  
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
        const text = chunk.toString();
        if (text.trim().startsWith("data:")) {
          const streamChunks = text.split("\n\n").filter(Boolean);
  
          for (let i = 0; i < streamChunks.length; i++) {
            let data = streamChunks[i];
            res.write(data + "\n\n");
          }
        }
      });
  
      response.data.on("end", () => {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      });
  
      response.data.on("error", (err) => {
        console.error("Stream hatası:", err);
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ error: "Akışta bir hata oluştu." })}\n\n`);
          res.end();
        }
      });
    } catch (error) {
      console.error("AIFlow bağlantı hatası:", error.message);
      if (!res.writableEnded) {
        res.write(
          `data: ${JSON.stringify({
            error: "AIFlow'a bağlanırken bir hata oluştu.",
          })}\n\n`
        );
        res.end();
      }
    }
  };
  
