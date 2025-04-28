const Roles = require("../models/Roles");
const RolePrivileges = require("../models/RolePrivileges");
const UserRoles = require("../models/UserRoles");
const CustomError = require("../utils/CustomError");
const AuditLogs = require("../services/auditlogs.service");

exports.getAll = async () => {
  const roles = await Roles.find({}).lean();
  for (let role of roles) {
    const permissions = await RolePrivileges.find({ role_id: role._id });
    role.permissions = permissions.map((p) => p.permission);
  }
  return roles;
};

exports.getById = async (id) => {
  const role = await Roles.findById(id).lean();
  if (!role) return null;
  const permissions = await RolePrivileges.find({ role_id: id });
  role.permissions = permissions.map((p) => p.permission);
  return role;
};

exports.getRoleUsage = async (roleId) => {
  const usage = await UserRoles.find({ role_id: roleId });
  return usage;
};

exports.add = async ({ role_name, permissions }, user) => {
  const existing = await Roles.findOne({ role_name });
  if (existing) throw new CustomError(409, "Conflict", "Bu rol zaten mevcut");

  const role = await Roles.create({
    role_name,
    is_active: true,
    created_by: user.id,
  });

  const permissionDocs = permissions.map((perm) => ({
    role_id: role._id,
    permission: perm,
    created_by: user.id,
  }));

  await RolePrivileges.insertMany(permissionDocs);

  AuditLogs.info(user.email, "Roles", "Add", { role });

  return { success: true };
};

exports.update = async ({ _id, role_name, is_active, permissions }, user) => {
  const role = await Roles.findById(_id);
  if (!role) throw new CustomError(404, "Not Found", "Rol bulunamadı");

  if (role_name !== undefined) role.role_name = role_name;
  if (is_active !== undefined) role.is_active = is_active;
  await role.save();

  if (Array.isArray(permissions)) {
    await RolePrivileges.deleteMany({ role_id: _id });
    const newPermissions = permissions.map((perm) => ({
      role_id: _id,
      permission: perm,
      created_by: user.id,
    }));
    await RolePrivileges.insertMany(newPermissions);
  }

  AuditLogs.info(user.email, "Roles", "Update", { role_id: _id });

  return { success: true };
};

exports.remove = async (_id, user) => {
  const usage = await UserRoles.findOne({ role_id: _id });
  if (usage) throw new CustomError(403, "Forbidden", "Bu rol atanmış, silinemez");

  await RolePrivileges.deleteMany({ role_id: _id });
  await Roles.deleteOne({ _id });

  AuditLogs.info(user.email, "Roles", "Delete", { _id });

  return { success: true };
};
