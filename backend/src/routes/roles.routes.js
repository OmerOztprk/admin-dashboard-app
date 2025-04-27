const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { addRoleSchema, updateRoleSchema, deleteRoleSchema } = require("../validators/role.validator");

router.use(auth.authenticate());

// Sabit endpointler en önce
router.get("/role_privileges", roleController.getPrivileges);

// CRUD işlemleri
router.get("/", auth.checkRoles("role_view"), roleController.getAll);
router.get("/:id", auth.checkRoles("role_view"), roleController.getById);
router.get("/:id/usage", auth.checkRoles("role_view"), roleController.getRoleUsage);

router.post("/add", auth.checkRoles("role_add"), validate(addRoleSchema), roleController.add);
router.post("/update", auth.checkRoles("role_update"), validate(updateRoleSchema), roleController.update);
router.post("/delete", auth.checkRoles("role_delete"), validate(deleteRoleSchema), roleController.remove);

module.exports = router;
