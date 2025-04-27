const Users = require("../models/Users");
const UserRoles = require("../models/UserRoles");
const bcrypt = require("bcryptjs");
const CustomError = require("../utils/CustomError");
const Enum = require("../config/Enum");
const AuditLogs = require("./auditlogs.service");

exports.getAll = async () => {
  const users = await Users.find({}, { password: 0 }).lean();

  for (let user of users) {
    const roles = await UserRoles.find({ user_id: user._id }).populate("role_id");
    user.roles = roles.map((r) => r.role_id?.role_name);
  }

  return users;
};

exports.getById = async (id) => {
  const user = await Users.findById(id, { password: 0 }).lean();
  if (!user) return null;

  const roles = await UserRoles.find({ user_id: id }).populate("role_id");
  user.roles = roles.map((r) => r.role_id?.role_name);

  return user;
};

exports.add = async ({ email, password, first_name, last_name, phone_number, is_active, roles }, currentUser) => {
  const existingUser = await Users.findOne({ email });
  if (existingUser) throw new CustomError(409, "Already exists", "Bu email zaten kayıtlı.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Users.create({
    email,
    password: hashedPassword,
    first_name,
    last_name,
    phone_number,
    is_active: is_active !== false,
  });

  await UserRoles.insertMany(roles.map(roleId => ({
    user_id: user._id,
    role_id: roleId,
  })));

  AuditLogs.info(currentUser.email, "Users", "Add", { user });

  return { success: true };
};

exports.update = async ({ _id, email, password, first_name, last_name, phone_number, is_active, roles }, currentUser) => {
  const updates = {};
  if (email) updates.email = email;
  if (password) updates.password = await bcrypt.hash(password, 10);
  if (typeof is_active === "boolean") updates.is_active = is_active;
  if (first_name !== undefined) updates.first_name = first_name;
  if (last_name !== undefined) updates.last_name = last_name;
  if (phone_number !== undefined) updates.phone_number = phone_number;

  await Users.updateOne({ _id }, updates);

  if (Array.isArray(roles)) {
    await UserRoles.deleteMany({ user_id: _id });
    await UserRoles.insertMany(roles.map(roleId => ({
      user_id: _id,
      role_id: roleId,
    })));
  }

  AuditLogs.info(currentUser.email, "Users", "Update", { _id, updates });

  return { success: true };
};

exports.remove = async (id, currentUser) => {
  if (id === currentUser.id) {
    throw new CustomError(400, "Forbidden", "Kendi hesabını silemezsin.");
  }

  await Users.deleteOne({ _id: id });
  await UserRoles.deleteMany({ user_id: id });

  AuditLogs.info(currentUser.email, "Users", "Delete", { _id: id });

  return { success: true };
};
