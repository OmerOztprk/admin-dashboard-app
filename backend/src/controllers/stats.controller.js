const StatsService = require("../services/stats.service");
const Response = require("../utils/Response");

exports.auditLogStats = async (req, res) => {
  try {
    const result = await StatsService.auditLogs(req.body);
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.uniqueCategoryCount = async (req, res) => {
  try {
    const result = await StatsService.uniqueCategories(req.body);
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.userCount = async (req, res) => {
  try {
    const result = await StatsService.userCount(req.body);
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};
