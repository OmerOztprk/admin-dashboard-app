const yup = require("yup");

const addCustomerSchema = yup.object({
  name: yup.string().required("İsim zorunludur."),
  slug: yup.string().required("Slug zorunludur."),
  email: yup.string().email().nullable(),
  phone: yup.string().nullable(),
  customPrompt: yup.string().nullable(),
  is_active: yup.boolean().optional(),
});

const updateCustomerSchema = yup.object({
  _id: yup.string().required("_id zorunludur."),
  name: yup.string().optional(),
  slug: yup.string().optional(),
  email: yup.string().email().optional(),
  phone: yup.string().optional(),
  customPrompt: yup.string().optional(),
  is_active: yup.boolean().optional(),
});

const deleteCustomerSchema = yup.object({
  _id: yup.string().required("_id zorunludur."),
});

module.exports = {
  addCustomerSchema,
  updateCustomerSchema,
  deleteCustomerSchema,
};
