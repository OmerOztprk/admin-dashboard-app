const express = require("express");
const router = express.Router();
const emitter = require("../core/Emitter");
const { HTTP_CODES } = require("../config/Enum");

emitter.addEmitter("notifications");

router.get("/", (req, res) => {
  res.writeHead(HTTP_CODES.OK, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });

  const send = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  emitter.getEmitter("notifications").on("message", send);

  req.on("close", () => {
    emitter.getEmitter("notifications").off("message", send);
  });
});

module.exports = router;
