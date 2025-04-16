const AuditLogs = require("../models/AuditLogs");
const Categories = require("../models/Categories");
const Users = require("../models/Users");
const mongoose = require("mongoose");

exports.auditLogs = async (body) => {
  const filter = {};

  if (typeof body.location === "string") {
    filter.location = body.location;
  }

  const result = await AuditLogs.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { email: "$email", proc_type: "$proc_type" },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return result;
};

exports.uniqueCategories = async (body) => {
  const filter = {};
  if (typeof body.is_active === "boolean") {
    filter.is_active = body.is_active;
  }

  const result = await Categories.distinct("name", filter);
  return { result, count: result.length };
};

exports.userCount = async (body) => {
  const filter = {};
  if (typeof body.is_active === "boolean") {
    filter.is_active = body.is_active;
  }

  const count = await Users.countDocuments(filter);
  return { count };
};
