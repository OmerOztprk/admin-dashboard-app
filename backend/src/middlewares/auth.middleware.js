const jwt = require("jsonwebtoken");
const config = require("../config");
const Users = require("../models/Users");
const UserRoles = require("../models/UserRoles");
const RolePrivileges = require("../models/RolePrivileges");
const privilegesList = require("../config/role_privileges").privileges;
const CustomError = require("../utils/CustomError");

exports.authenticate = () => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new CustomError(401, "Unauthorized", "Token gerekli"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT.SECRET);

    const user = await Users.findById(decoded.id);
    if (!user) throw new CustomError(401, "Unauthorized", "Kullanıcı bulunamadı");

    const roles = await UserRoles.find({ user_id: user._id });
    const roleIds = roles.map((r) => r.role_id);

    const privileges = await RolePrivileges.find({ role_id: { $in: roleIds } });
    const resolvedPrivileges = privileges.map((p) => {
      return privilegesList.find((x) => x.key === p.permission);
    }).filter(Boolean);

    req.user = {
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      language: user.language,
      roles: resolvedPrivileges
    };

    next();
  } catch (err) {
    return next(new CustomError(403, "Forbidden", "Geçersiz veya süresi dolmuş token"));
  }
};

exports.checkRoles = (...expectedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return next(new CustomError(403, "Forbidden", "Yetkisiz erişim"));
    }

    const hasRole = req.user.roles.some((role) =>
      expectedRoles.includes(role.key)
    );

    if (!hasRole) {
      return next(new CustomError(403, "Forbidden", "Bu işlemi yapmaya yetkin yok"));
    }

    next();
  };
};
