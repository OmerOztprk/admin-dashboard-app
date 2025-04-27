const Users = require("../models/Users");
const Roles = require("../models/Roles");
const UserRoles = require("../models/UserRoles");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const config = require("../config");
const {
  generateCode,
  send2FACodeEmail,
  signJWT,
} = require("../utils/auth.helper");
const { validateAuthFields } = require("../validators/auth.validator"); // ✅ yeni import

exports.register = async ({
  email,
  password,
  first_name,
  last_name,
  phone_number,
}) => {
  // Yeni validasyon çağrısı
  validateAuthFields(email, password);

  const existing = await Users.findOne({ email });
  if (existing)
    throw new CustomError(409, "Conflict", "Bu email zaten kayıtlı.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Users.create({
    email,
    password: hashedPassword,
    first_name,
    last_name,
    phone_number,
    is_active: true,
  });

  let role = await Roles.findOne({ role_name: "USER" });
  if (role) {
    await UserRoles.create({ user_id: user._id, role_id: role._id });
  }

  return { success: true };
};

exports.login = async ({ email, password }) => {
  validateAuthFields(email, password);

  const user = await Users.findOne({ email });
  if (!user) throw new CustomError(401, "Unauthorized", "Kullanıcı bulunamadı");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new CustomError(401, "Unauthorized", "Şifre hatalı");

  const code = generateCode();
  user.two_factor_code = code;
  user.two_factor_expire = Date.now() + 5 * 60 * 1000; // 5 dk
  await user.save();

  await send2FACodeEmail(user.email, code);

  return { step: "2fa", userId: user._id };
};

exports.verifyCode = async ({ userId, code }) => {
  const user = await Users.findById(userId);
  if (!user) throw new CustomError(401, "Unauthorized", "Kullanıcı bulunamadı");

  const expired = Date.now() > user.two_factor_expire;
  if (user.two_factor_code !== code || expired) {
    throw new CustomError(401, "Unauthorized", "Kod yanlış veya süresi dolmuş");
  }

  user.two_factor_code = null;
  user.two_factor_expire = null;
  await user.save();

  const token = signJWT({ id: user._id, email: user.email });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    },
  };
};
