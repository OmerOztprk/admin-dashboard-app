const RoleService = require("../services/role.service");
const Response = require("../utils/Response");

exports.getAll = async (req, res) => {
  try {
    const result = await RoleService.getAll();
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.add = async (req, res) => {
  try {
    const result = await RoleService.add(req.body, req.user);
    res.status(201).json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.update = async (req, res) => {
  try {
    const result = await RoleService.update(req.body, req.user);
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await RoleService.remove(req.body._id, req.user);
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.getPrivileges = (req, res) => {
  const privileges = require("../config/role_privileges");
  res.json(Response.success(privileges));
};
