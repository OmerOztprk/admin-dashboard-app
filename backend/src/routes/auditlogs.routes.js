const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const AuditLogs = require("../models/AuditLogs");
const Response = require("../utils/Response");
const moment = require("moment");

// Tüm rotalarda auth olsun
router.use(auth.authenticate());

// Sadece auditlogs_view yetkisi olanlara
router.post("/", auth.checkRoles("auditlogs_view"), async (req, res) => {
  try {
    let { begin_date, end_date, skip = 0, limit = 100 } = req.body;

    const filter = {
      created_at: {
        $gte: begin_date ? moment(begin_date).startOf("day") : moment().subtract(1, "day"),
        $lte: end_date ? moment(end_date).endOf("day") : moment()
      }
    };

    const logs = await AuditLogs.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json(Response.success(logs));
  } catch (err) {
    res.status(500).json(Response.error(err));
  }
});

module.exports = router;
