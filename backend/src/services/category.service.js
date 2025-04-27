const Categories = require("../models/Categories");
const CustomError = require("../utils/CustomError");
const Enum = require("../config/Enum");
const AuditLogs = require("./auditlogs.service");
const Export = require("./excel.export.service");
const Import = require("./excel.import.service");
const fs = require("fs");
const path = require("path");

exports.getAll = async () => {
  return await Categories.find({}).lean();
};

exports.getById = async (id) => {
  const category = await Categories.findById(id).lean();
  if (!category) {
    throw new CustomError(
      Enum.HTTP_CODES.NOT_FOUND,
      "Kategori bulunamadı",
      "Belirtilen ID'ye sahip kategori yok."
    );
  }
  return category;
};

exports.add = async ({ name }, user) => {
  const category = await Categories.create({
    name,
    is_active: true,
    created_by: user.id,
  });

  AuditLogs.info(user.email, "Categories", "Add", category);
  return { success: true };
};

exports.update = async ({ _id, name, is_active }, user) => {
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (is_active !== undefined) updates.is_active = is_active;

  const updated = await Categories.findByIdAndUpdate(_id, updates, { new: true });
  if (!updated) {
    throw new CustomError(
      Enum.HTTP_CODES.NOT_FOUND,
      "Kategori bulunamadı",
      "Belirtilen ID'ye sahip kategori yok."
    );
  }

  AuditLogs.info(user.email, "Categories", "Update", { _id, updates });
  return { success: true };
};

exports.remove = async (_id, user) => {
  const deleted = await Categories.findByIdAndDelete(_id);
  if (!deleted) {
    throw new CustomError(
      Enum.HTTP_CODES.NOT_FOUND,
      "Kategori bulunamadı",
      "Belirtilen ID'ye sahip kategori yok."
    );
  }

  AuditLogs.info(user.email, "Categories", "Delete", { _id });
  return { success: true };
};

exports.exportExcel = async () => {
  const categories = await Categories.find({}).lean();

  const excelBuffer = Export.toExcel(
    ["NAME", "IS ACTIVE?", "USER_ID", "CREATED AT", "UPDATED AT"],
    ["name", "is_active", "created_by", "created_at", "updated_at"],
    categories
  );

  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    `categories_export_${Date.now()}.xlsx`
  );
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
        created_by: user.id,
      });
    }
  }

  return { success: true };
};
