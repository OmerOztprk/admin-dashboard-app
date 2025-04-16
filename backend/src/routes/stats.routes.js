const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");
const auth = require("../middlewares/auth.middleware");

router.use(auth.authenticate());

router.post("/auditlogs", statsController.auditLogStats);
router.post("/categories/unique", statsController.uniqueCategoryCount);
router.post("/users/count", statsController.userCount);

module.exports = router;
