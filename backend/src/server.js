// src/server.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config(); // .env dosyasını oku

const app = require("./app");
const config = require("./config");

const PORT = config.PORT || 5000;
const CONNECTION_STRING = config.CONNECTION_STRING;

console.log("⏳ MongoDB bağlantısı kuruluyor...");

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB bağlantısı başarılı.");
    app.listen(PORT, () => {
      console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB bağlantı hatası:", err);
    process.exit(1);
  });
