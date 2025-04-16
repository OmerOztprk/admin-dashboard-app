const Categories = require("../models/Categories");
const CustomError = require("../utils/CustomError");
const Enum = require("../config/Enum");
const AuditLogs = require("./audit.service");
const Export = require("./excel.export.service");
const Import = require("./excel.import.service");
const fs = require("fs");
const path = require("path");

exports.getAll = async () => {
  return await Categories.find({});
};

exports.add = async (body, user) => {
  if (!body.name) {
    throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Geçersiz istek", "Kategori adı zorunludur.");
  }

  const category = await Categories.create({
    name: body.name,
    is_active: true,
    created_by: user.id
  });

  AuditLogs.info(user.email, "Categories", "Add", category);
  return { success: true };
};

exports.update = async (body, user) => {
  if (!body._id) {
    throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Geçersiz istek", "_id zorunludur.");
  }

  const updates = {};
  if (body.name) updates.name = body.name;
  if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

  await Categories.updateOne({ _id: body._id }, updates);

  AuditLogs.info(user.email, "Categories", "Update", { _id: body._id, ...updates });
  return { success: true };
};

exports.remove = async (_id, user) => {
  if (!_id) {
    throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Geçersiz istek", "_id zorunludur.");
  }

  await Categories.deleteOne({ _id });
  AuditLogs.info(user.email, "Categories", "Delete", { _id });
  return { success: true };
};

exports.exportExcel = async () => {
  const categories = await Categories.find({});

  const excelBuffer = Export.toExcel(
    ["NAME", "IS ACTIVE?", "USER_ID", "CREATED AT", "UPDATED AT"],
    ["name", "is_active", "created_by", "created_at", "updated_at"],
    categories
  );

  const filePath = path.join(__dirname, "..", "uploads", `categories_export_${Date.now()}.xlsx`);
  fs.writeFileSync(filePath, excelBuffer);
  return filePath;
};

exports.importExcel = async (filePath, user) => {
  const rows = Import.fromExcel(filePath);

  for (let i = 1; i < rows.length; i++) {
    const [name, is_active] = rows[i];
    if (name) {
      await Categories.create({
        name,
        is_active: is_active === true || is_active === "true",
        created_by: user.id
      });
    }
  }

  return { success: true };
};
