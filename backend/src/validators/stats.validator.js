const yup = require("yup");

const auditLogStatsSchema = yup.object({
  location: yup.string().optional(),
});

const uniqueCategoryCountSchema = yup.object({
  is_active: yup.boolean().optional(),
});

const userCountSchema = yup.object({
  is_active: yup.boolean().optional(),
});

module.exports = {
  auditLogStatsSchema,
  uniqueCategoryCountSchema,
  userCountSchema,
};
