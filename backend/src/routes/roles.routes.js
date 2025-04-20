const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");
const auth = require("../middlewares/auth.middleware");

router.use(auth.authenticate());

router.get("/", auth.checkRoles("role_view"), roleController.getAll);
router.post("/add", auth.checkRoles("role_add"), roleController.add);
router.post("/update", auth.checkRoles("role_update"), roleController.update);
router.post("/delete", auth.checkRoles("role_delete"), roleController.remove);
router.get("/role_privileges", roleController.getPrivileges); // sabit config listesi
router.get("/:id", auth.checkRoles("role_view"), roleController.getById);
router.get("/:id/usage", auth.checkRoles("role_view"), roleController.getRoleUsage);

module.exports = router;
