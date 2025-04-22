const axios = require("axios");

const AIFLOW_URL = process.env.AIFLOW_URL;

if (!AIFLOW_URL) {
    console.error("⚠️ AIFLOW_URL .env dosyasında tanımlı değil.");
    process.exit(1);
}

exports.streamFromAIFlow = async (userMessage, customPrompt, res) => {
    try {
        console.log('🟢 AIFlow çağrısı başlatıldı:');
        console.log('📨 Kullanıcı Mesajı:', userMessage);
        console.log('🧠 Custom Prompt:', customPrompt || '[boş]');
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const response = await axios({
            method: "post",
            url: AIFLOW_URL,
            data: { message: userMessage, custom_prompt: customPrompt },
            headers: { "Content-Type": "application/json" },
            responseType: "stream",
        });

        response.data.on("data", (chunk) => {
            const text = chunk.toString();

            if (text.trim().startsWith("data:")) {
                const dataArray = text.split("\n\n").filter(Boolean);
                for (const data of dataArray) {
                    res.write(data + "\n\n");
                }
            } else {
                // Fallback: AIFlow `data:` başlığı koymamışsa da işleyelim
                res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
        });

        response.data.on("end", () => {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            res.end();
        });

        response.data.on("error", (err) => {
            console.error("AIFlow stream hatası:", err);
            res.write(
                `data: ${JSON.stringify({ error: "Akış sırasında hata oluştu." })}\n\n`
            );
            res.end();
        });
    } catch (error) {
        console.error("AIFlow bağlantı hatası:", error.message);
        res.write(
            `data: ${JSON.stringify({
                error: "AIFlow sunucusuna bağlanılamadı.",
            })}\n\n`
        );
        res.end();
    }
};
