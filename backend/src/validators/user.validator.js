const yup = require("yup");

const addUserSchema = yup.object({
  email: yup.string().email("Geçerli email giriniz").required("Email zorunludur"),
  password: yup.string().min(6, "Şifre en az 6 karakter olmalı").required("Şifre zorunludur"),
  first_name: yup.string().nullable(),
  last_name: yup.string().nullable(),
  phone_number: yup.string().nullable(),
  is_active: yup.boolean().optional(),
  roles: yup.array().of(yup.string()).min(1, "En az bir rol seçilmelidir").required("Roller zorunludur"),
});

const updateUserSchema = yup.object({
  _id: yup.string().required("_id zorunludur"),
  email: yup.string().email("Geçerli email giriniz").optional(),
  password: yup.string().min(6, "Şifre en az 6 karakter olmalı").optional(),
  first_name: yup.string().nullable(),
  last_name: yup.string().nullable(),
  phone_number: yup.string().nullable(),
  is_active: yup.boolean().optional(),
  roles: yup.array().of(yup.string()).optional(),
});

const deleteUserSchema = yup.object({
  _id: yup.string().required("_id zorunludur"),
});

module.exports = {
  addUserSchema,
  updateUserSchema,
  deleteUserSchema,
};
