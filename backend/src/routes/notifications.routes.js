const express = require("express");
const router = express.Router();
const emitter = require("../core/Emitter");
const { HTTP_CODES } = require("../config/Enum");
const auth = require("../middlewares/auth.middleware");

emitter.addEmitter("notifications");

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

    notificationsEmitter.on("message", sendNotification);

    req.on("close", () => {
      clearInterval(heartbeat);
      notificationsEmitter.off("message", sendNotification);
    });

  } catch (err) {
    console.error("Notification SSE hata:", err);
    res.end();
  }
});

module.exports = router;
