const AuditLogs = require("../models/AuditLogs");
const Categories = require("../models/Categories");
const Users = require("../models/Users");

exports.auditLogs = async ({ location }) => {
  const filter = {};

  if (location) {
    filter.location = location;
  }

  const result = await AuditLogs.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { email: "$email", proc_type: "$proc_type" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return result;
};

exports.uniqueCategories = async ({ is_active }) => {
  const filter = {};

  if (typeof is_active === "boolean") {
    filter.is_active = is_active;
  }

  const categories = await Categories.distinct("name", filter);

  return { categories, count: categories.length };
};

exports.userCount = async ({ is_active }) => {
  const filter = {};

  if (typeof is_active === "boolean") {
    filter.is_active = is_active;
  }

  const count = await Users.countDocuments(filter);

  return { count };
};
