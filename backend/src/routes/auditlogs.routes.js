const express = require("express");
const router = express.Router();
const auditLogsController = require("../controllers/auditlogs.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { fetchAuditLogsSchema } = require("../validators/auditlogs.validator");

router.use(auth.authenticate());

router.post("/", auth.checkRoles("auditlogs_view"), validate(fetchAuditLogsSchema), auditLogsController.fetchLogs);

module.exports = router;
