const yup = require("yup");

const fetchAuditLogsSchema = yup.object({
  begin_date: yup.date().optional(),
  end_date: yup.date().optional(),
  skip: yup.number().min(0).default(0),
  limit: yup.number().min(1).max(1000).default(100),
});

module.exports = {
  fetchAuditLogsSchema,
};
