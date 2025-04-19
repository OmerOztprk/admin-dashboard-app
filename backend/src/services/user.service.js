const Users = require("../models/Users");
const UserRoles = require("../models/UserRoles");
const Roles = require("../models/Roles");
const bcrypt = require("bcryptjs");
const CustomError = require("../utils/CustomError");
const Enum = require("../config/Enum");
const AuditLogs = require("./audit.service");

exports.getAll = async () => {
  const users = await Users.find({}, { password: 0 }).lean();

  for (let user of users) {
    const roles = await UserRoles.find({ user_id: user._id }).populate(
      "role_id"
    );
    user.roles = roles.map((r) => r.role_id?.role_name);
  }

  return users;
};

exports.getById = async (id) => {
  const user = await Users.findById(id, { password: 0 }).lean();
  if (!user) return null;

  const roles = await UserRoles.find({ user_id: id }).populate("role_id");
  user.roles = roles.map(r => r.role_id?.role_name);

  return user;
};

exports.add = async (body, currentUser) => {
  if (
    !body.email ||
    !body.password ||
    !Array.isArray(body.roles) ||
    body.roles.length === 0
  ) {
    throw new CustomError(
      400,
      "Validation error",
      "Email, password ve roller zorunludur."
    );
  }

  const existingUser = await Users.findOne({ email: body.email });
  if (existingUser)
    throw new CustomError(409, "Already exists", "Bu email zaten kayıtlı.");

  const password = await bcrypt.hash(body.password, 10);
  const user = await Users.create({
    email: body.email,
    password,
    is_active: body.is_active !== false,
    first_name: body.first_name,
    last_name: body.last_name,
    phone_number: body.phone_number,
  });

  for (const roleId of body.roles) {
    await UserRoles.create({ user_id: user._id, role_id: roleId });
  }

  AuditLogs.info(currentUser.email, "Users", "Add", { user });

  return { success: true };
};

exports.update = async (body, currentUser) => {
  if (!body._id)
    throw new CustomError(400, "Validation error", "_id alanı zorunludur.");

  const updates = {};
  if (body.email) updates.email = body.email;
  if (body.password) updates.password = await bcrypt.hash(body.password, 10);
  if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
  if (body.first_name !== undefined) updates.first_name = body.first_name;
  if (body.last_name !== undefined) updates.last_name = body.last_name;
  if (body.phone_number !== undefined) updates.phone_number = body.phone_number;

  await Users.updateOne({ _id: body._id }, updates);

  if (Array.isArray(body.roles)) {
    await UserRoles.deleteMany({ user_id: body._id });
    for (const roleId of body.roles) {
      await UserRoles.create({ user_id: body._id, role_id: roleId });
    }
  }

  AuditLogs.info(currentUser.email, "Users", "Update", {
    _id: body._id,
    updates,
  });

  return { success: true };
};

exports.remove = async (id, currentUser) => {
  if (!id) throw new CustomError(400, "Validation error", "_id zorunlu");

  if (id === currentUser.id) {
    throw new CustomError(400, "Forbidden", "Kendi hesabını silemezsin.");
  }

  await Users.deleteOne({ _id: id });
  await UserRoles.deleteMany({ user_id: id });

  AuditLogs.info(currentUser.email, "Users", "Delete", { _id: id });

  return { success: true };
};
