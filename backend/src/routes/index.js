const express = require("express");
const router = express.Router();

// Modül bazlı route'lar
router.use("/users", require("./users.routes"));
router.use("/roles", require("./roles.routes"));
router.use("/categories", require("./categories.routes"));
router.use("/auditlogs", require("./auditlogs.routes"));
router.use("/stats", require("./stats.routes"));
router.use("/notifications", require("./notifications.routes"));
router.use("/auth", require("./auth.routes"));
router.use("/customers", require("./customer.routes"));
router.use("/aiflow", require("./aiflow.routes"));

module.exports = router;
