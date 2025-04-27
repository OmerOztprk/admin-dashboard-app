const express = require("express");
const router = express.Router();
const emitter = require("../core/Emitter");
const { HTTP_CODES } = require("../config/Enum");
const auth = require("../middlewares/auth.middleware"); // Eğer global auth kullanıyorsak!

// Event emitter başlat (bir kere)
emitter.addEmitter("notifications");

// Event emitter için maximum listener sayısını artır (default 10'dur, artırmazsak warning verir)
emitter.getEmitter("notifications").setMaxListeners(100);

router.use(auth.authenticate()); // Eğer SSE açan client kimlikli olacaksa!

router.get("/", (req, res) => {
  try {
    res.writeHead(HTTP_CODES.OK, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    // İlk bağlantıda "bağlantı kuruldu" mesajı
    res.write(`event: connection\n`);
    res.write(`data: ${JSON.stringify({ message: "Bağlantı kuruldu" })}\n\n`);

    const sendNotification = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const heartbeat = setInterval(() => {
      res.write(`event: ping\ndata: {}\n\n`);
    }, 25000); // 25 saniyede bir heartbeat (proxy kesilmesin)

    const notificationsEmitter = emitter.getEmitter("notifications");

    // Dinleyici ekle
    notificationsEmitter.on("message", sendNotification);

    // Bağlantı kapanınca
    req.on("close", () => {
      clearInterval(heartbeat); // Heartbeat durdur
      notificationsEmitter.off("message", sendNotification); // Dinleyiciyi kaldır
    });

  } catch (err) {
    console.error("Notification SSE hata:", err);
    res.end();
  }
});

module.exports = router;
