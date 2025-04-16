const Users = require("../models/Users");
const Roles = require("../models/Roles");
const UserRoles = require("../models/UserRoles");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const CustomError = require("../utils/CustomError");

exports.login = async ({ email, password }) => {
  const user = await Users.findOne({ email });

  if (!user) throw new CustomError(401, "Unauthorized", "Kullanıcı bulunamadı");
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new CustomError(401, "Unauthorized", "Şifre hatalı");

  const payload = {
    id: user._id,
    exp: Math.floor(Date.now() / 1000) + config.JWT.EXPIRE_TIME
  };

  const token = jwt.sign(payload, config.JWT.SECRET);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    }
  };
};

exports.register = async ({ email, password, first_name, last_name }) => {
  const existing = await Users.findOne({ email });
  if (existing) throw new CustomError(409, "Conflict", "Bu email zaten kayıtlı.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Users.create({
    email,
    password: hashedPassword,
    first_name,
    last_name,
    is_active: true
  });

  // Default olarak SUPER_ADMIN rolü varsa ata
  let role = await Roles.findOne({ role_name: "SUPER_ADMIN" });
  if (!role) {
    role = await Roles.create({ role_name: "SUPER_ADMIN", is_active: true });
  }

  await UserRoles.create({ user_id: user._id, role_id: role._id });

  return { success: true };
};
