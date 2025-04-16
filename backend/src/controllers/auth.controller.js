const Users = require("../models/Users");
const Roles = require("../models/Roles");
const UserRoles = require("../models/UserRoles");
const bcrypt = require("bcryptjs");
const Response = require("../utils/Response");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone_number } = req.body;

    if (!email || !password) {
      throw new CustomError(400, "Geçersiz istek", "Email ve şifre zorunludur");
    }

    const existing = await Users.findOne({ email });
    if (existing) {
      throw new CustomError(
        409,
        "Zaten kayıtlı",
        "Bu email zaten kullanılıyor"
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await Users.create({
      email,
      password: hashed,
      is_active: true,
      first_name,
      last_name,
      phone_number,
    });

    // USER rolü ata
    const userRole = await Roles.findOne({ role_name: "USER" });
    if (userRole) {
      await UserRoles.create({
        role_id: userRole._id,
        user_id: user._id,
      });
    }

    res.status(201).json(Response.success({ success: true }, 201));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError(400, "Geçersiz istek", "Email ve şifre zorunludur");
    }

    const user = await Users.findOne({ email });
    if (!user) {
      throw new CustomError(
        401,
        "Kimlik doğrulama hatası",
        "Kullanıcı bulunamadı"
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError(401, "Kimlik doğrulama hatası", "Şifre yanlış");
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: isNaN(process.env.TOKEN_EXPIRE_TIME)
        ? process.env.TOKEN_EXPIRE_TIME
        : parseInt(process.env.TOKEN_EXPIRE_TIME),
    });

    const userData = {
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    res.json(Response.success({ token, user: userData }));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};
