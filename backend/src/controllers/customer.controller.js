const Customer = require('../models/Customer');
const Response = require('../utils/Response');

exports.getAll = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ created_at: -1 });
    res.json(Response.success(customers));
  } catch (err) {
    res.status(500).json(Response.error(err));
  }
};

exports.getById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json(Response.error("Müşteri bulunamadı"));
    res.json(Response.success(customer));
  } catch (err) {
    res.status(500).json(Response.error(err));
  }
};

exports.add = async (req, res) => {
  try {
    const { name, slug, email, phone, customPrompt, is_active } = req.body;

    const existing = await Customer.findOne({ slug });
    if (existing) return res.status(400).json(Response.error("Slug zaten mevcut"));

    const customer = await Customer.create({
      name,
      slug,
      email,
      phone,
      customPrompt, // ✅ prompt kaydı
      is_active
    });

    res.status(201).json(Response.success(customer));
  } catch (err) {
    res.status(500).json(Response.error(err));
  }
};

exports.update = async (req, res) => {
  try {
    const { _id, name, slug, email, phone, is_active, customPrompt } = req.body;

    const updated = await Customer.findByIdAndUpdate(
      _id,
      {
        name,
        slug,
        email,
        phone,
        is_active,
        customPrompt, // ✅ güncelleme desteği
        updated_at: new Date()
      },
      { new: true }
    );

    if (!updated) return res.status(404).json(Response.error("Müşteri bulunamadı"));
    res.json(Response.success(updated));
  } catch (err) {
    res.status(500).json(Response.error(err));
  }
};

exports.remove = async (req, res) => {
  try {
    const { _id } = req.body;
    await Customer.findByIdAndDelete(_id);
    res.json(Response.success({ message: "Silindi" }));
  } catch (err) {
    res.status(500).json(Response.error(err));
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const customer = await Customer.findOne({ slug: req.params.slug });
    if (!customer) return res.status(404).json(Response.error("Müşteri bulunamadı"));
    res.json(Response.success(customer));
  } catch (err) {
    res.status(500).json(Response.error(err));
  }
};
