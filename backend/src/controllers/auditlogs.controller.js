const AuditLogs = require("../models/AuditLogs");
const Response = require("../utils/Response");
const moment = require("moment");

exports.fetchLogs = async (req, res) => {
  try {
    const { begin_date, end_date, skip = 0, limit = 100 } = req.body;

    const filter = {
      created_at: {
        $gte: begin_date ? moment(begin_date).startOf("day").toDate() : moment().subtract(1, "day").toDate(),
        $lte: end_date ? moment(end_date).endOf("day").toDate() : new Date(),
      }
    };

    const logs = await AuditLogs.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json(Response.success(logs));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};
