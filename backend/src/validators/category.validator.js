const yup = require("yup");

const addCategorySchema = yup.object({
  name: yup.string().required("Kategori adı zorunludur"),
});

const updateCategorySchema = yup.object({
  _id: yup.string().required("_id zorunludur"),
  name: yup.string().optional(),
  is_active: yup.boolean().optional(),
});

const deleteCategorySchema = yup.object({
  _id: yup.string().required("_id zorunludur"),
});

module.exports = {
  addCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
};
