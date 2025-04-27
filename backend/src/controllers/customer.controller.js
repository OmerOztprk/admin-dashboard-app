const CustomerService = require("../services/customer.service");
const Response = require("../utils/Response");

exports.getAll = async (req, res) => {
  try {
    const customers = await CustomerService.getAll();
    res.json(Response.success(customers));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.getById = async (req, res) => {
  try {
    const customer = await CustomerService.getById(req.params.id);
    res.json(Response.success(customer));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const customer = await CustomerService.getBySlug(req.params.slug);
    res.json(Response.success(customer));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.add = async (req, res) => {
  try {
    const customer = await CustomerService.add(req.body);
    res.status(201).json(Response.success(customer));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await CustomerService.update(req.body);
    res.json(Response.success(updated));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await CustomerService.remove(req.body._id);
    res.json(Response.success(result));
  } catch (err) {
    res.status(err.code || 500).json(Response.error(err));
  }
};
