const Roles = require("../models/Roles");
const RolePrivileges = require("../models/RolePrivileges");
const UserRoles = require("../models/UserRoles");
const CustomError = require("../utils/CustomError");
const Enum = require("../config/Enum");
const AuditLogs = require("./audit.service");

exports.getAll = async () => {
  const roles = await Roles.find({}).lean();

  for (let role of roles) {
    const permissions = await RolePrivileges.find({ role_id: role._id });
    role.permissions = permissions.map(p => p.permission);
  }

  return roles;
};

exports.add = async (body, user) => {
  if (!body.role_name || !Array.isArray(body.permissions) || body.permissions.length === 0) {
    throw new CustomError(400, "Validation Error", "Rol adı ve en az 1 yetki gerekli.");
  }

  const role = await Roles.create({
    role_name: body.role_name,
    is_active: true,
    created_by: user.id
  });

  for (const perm of body.permissions) {
    await RolePrivileges.create({
      role_id: role._id,
      permission: perm,
      created_by: user.id
    });
  }

  AuditLogs.info(user.email, "Roles", "Add", { role });

  return { success: true };
};

exports.update = async (body, user) => {
  if (!body._id) {
    throw new CustomError(400, "Validation Error", "_id gerekli.");
  }

  const updates = {};
  if (body.role_name) updates.role_name = body.role_name;
  if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

  await Roles.updateOne({ _id: body._id }, updates);

  if (Array.isArray(body.permissions)) {
    const existing = await RolePrivileges.find({ role_id: body._id });
    const existingPerms = existing.map(p => p.permission);

    const newPerms = body.permissions.filter(p => !existingPerms.includes(p));
    const removed = existing.filter(x => !body.permissions.includes(x.permission));

    if (removed.length > 0) {
      await RolePrivileges.deleteMany({ _id: { $in: removed.map(x => x._id) } });
    }

    for (const perm of newPerms) {
      await RolePrivileges.create({
        role_id: body._id,
        permission: perm,
        created_by: user.id
      });
    }
  }

  AuditLogs.info(user.email, "Roles", "Update", { role_id: body._id, updates });

  return { success: true };
};

exports.remove = async (_id, user) => {
  if (!_id) throw new CustomError(400, "Validation Error", "_id gerekli.");

  // Rol herhangi bir kullanıcıya atanmışsa silme
  const usage = await UserRoles.findOne({ role_id: _id });
  if (usage) throw new CustomError(403, "Kullanılıyor", "Bu rol atanmış, silinemez.");

  await RolePrivileges.deleteMany({ role_id: _id });
  await Roles.deleteOne({ _id });

  AuditLogs.info(user.email, "Roles", "Delete", { _id });

  return { success: true };
};
