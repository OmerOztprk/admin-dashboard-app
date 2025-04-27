const UserService = require("../services/user.service");
const Response = require("../utils/Response");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAll();
    res.json(Response.success(users));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err, req.user?.language));
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await UserService.getById(req.params.id);
    if (!user) return res.status(404).json(Response.error("Kullanıcı bulunamadı"));
    res.json(Response.success(user));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err, req.user?.language));
  }
};

exports.addUser = async (req, res) => {
  try {
    const user = await UserService.add(req.body, req.user);
    res.status(201).json(Response.success(user));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err, req.user?.language));
  }
};

exports.updateUser = async (req, res) => {
  try {
    const result = await UserService.update(req.body, req.user);
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err, req.user?.language));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await UserService.remove(req.body._id, req.user);
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err, req.user?.language));
  }
};
