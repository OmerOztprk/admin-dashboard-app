const AuthService = require("../services/auth.service");
const Response = require("../utils/Response");

exports.register = async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    return res.status(201).json(Response.success(result));
  } catch (err) {
    return res.status(err.code || 500).json(Response.error(err));
  }
};

exports.login = async (req, res) => {
  try {
    const result = await AuthService.login(req.body);
    return res.json(Response.success(result));
  } catch (err) {
    return res.status(err.code || 500).json(Response.error(err));
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const result = await AuthService.verifyCode(req.body);
    return res.json(Response.success(result));
  } catch (err) {
    return res.status(err.code || 500).json(Response.error(err));
  }
};
