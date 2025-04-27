const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { auditLogStatsSchema, uniqueCategoryCountSchema, userCountSchema } = require("../validators/stats.validator");

router.use(auth.authenticate());

router.post("/auditlogs", auth.checkRoles("auditlogs_view"), validate(auditLogStatsSchema), statsController.auditLogStats);
router.post("/categories/unique", auth.checkRoles("stats_view"), validate(uniqueCategoryCountSchema), statsController.uniqueCategoryCount);
router.post("/users/count", auth.checkRoles("stats_view"), validate(userCountSchema), statsController.userCount);

module.exports = router;
