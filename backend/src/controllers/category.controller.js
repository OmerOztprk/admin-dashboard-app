const CategoryService = require("../services/category.service");
const Response = require("../utils/Response");

exports.getAll = async (req, res) => {
  try {
    const data = await CategoryService.getAll();
    res.json(Response.success(data));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.getById = async (req, res) => {
  try {
    const category = await CategoryService.getById(req.params.id);
    res.json(Response.success(category));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.add = async (req, res) => {
  try {
    const result = await CategoryService.add(req.body, req.user);
    res.status(201).json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.update = async (req, res) => {
  try {
    const result = await CategoryService.update(req.body, req.user);
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await CategoryService.remove(req.body._id, req.user);
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.exportToExcel = async (req, res) => {
  try {
    const filePath = await CategoryService.exportExcel();
    res.download(filePath);
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.importFromExcel = async (req, res) => {
  try {
    const result = await CategoryService.importExcel(req.file.path, req.user);
    res.status(201).json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};
