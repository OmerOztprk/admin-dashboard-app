const Customer = require("../models/Customer");
const CustomError = require("../utils/CustomError");
const Enum = require("../config/Enum");

exports.getAll = async () => {
  return await Customer.find().sort({ created_at: -1 });
};

exports.getById = async (id) => {
  const customer = await Customer.findById(id);
  if (!customer) {
    throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "Müşteri bulunamadı");
  }
  return customer;
};

exports.getBySlug = async (slug) => {
  const customer = await Customer.findOne({ slug });
  if (!customer) {
    throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "Müşteri bulunamadı");
  }
  return customer;
};

exports.add = async (body) => {
  const existing = await Customer.findOne({ slug: body.slug });
  if (existing) {
    throw new CustomError(Enum.HTTP_CODES.CONFLICT, "Slug zaten mevcut");
  }

  const customer = await Customer.create(body);
  return customer;
};

exports.update = async (body) => {
  const updated = await Customer.findByIdAndUpdate(
    body._id,
    { ...body, updated_at: new Date() },
    { new: true }
  );

  if (!updated) {
    throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "Müşteri bulunamadı");
  }
  return updated;
};

exports.remove = async (_id) => {
  const deleted = await Customer.findByIdAndDelete(_id);
  if (!deleted) {
    throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "Müşteri bulunamadı");
  }
  return { message: "Müşteri silindi" };
};
