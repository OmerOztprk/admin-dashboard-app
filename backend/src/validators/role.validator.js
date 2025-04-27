const yup = require("yup");

const addRoleSchema = yup.object({
  role_name: yup.string().required("Rol ismi zorunludur"),
  permissions: yup.array().of(yup.string()).min(1, "En az bir yetki seçilmelidir").required(),
});

const updateRoleSchema = yup.object({
  _id: yup.string().required("Rol ID zorunludur"),
  role_name: yup.string().optional(),
  is_active: yup.boolean().optional(),
  permissions: yup.array().of(yup.string()).optional(),
});

const deleteRoleSchema = yup.object({
  _id: yup.string().required("Rol ID zorunludur"),
});

module.exports = {
  addRoleSchema,
  updateRoleSchema,
  deleteRoleSchema,
};
