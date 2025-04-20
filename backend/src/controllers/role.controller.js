const RoleService = require("../services/role.service");
const Response = require("../utils/Response");
const UserRoles = require("../models/UserRoles"); // 🔧 Eksik import eklendi

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
  try {
    const privileges = require("../config/role_privileges");
    res.json(Response.success(privileges));
  } catch (err) {
    res.status(500).json(Response.error(err));
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await RoleService.getById(req.params.id);
    if (!result) {
      return res.status(404).json(Response.error("Rol bulunamadı"));
    }
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.getRoleUsage = async (req, res) => {
  try {
    const roleId = req.params.id;
    const usage = await UserRoles.find({ role_id: roleId });
    res.json(Response.success(usage));
  } catch (err) {
    console.error("❌ Kullanım kontrol hatası:", err);
    res.status(500).json(Response.error("Rol kullanım durumu alınamadı"));
  }
};
