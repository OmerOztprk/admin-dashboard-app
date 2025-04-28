const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { addUserSchema, updateUserSchema, deleteUserSchema } = require("../validators/user.validator");

router.use(auth.authenticate());

router.get("/profile", userController.getProfile);
router.get("/", auth.checkRoles("user_view"), userController.getAllUsers);
router.get("/:id", auth.checkRoles("user_view"), userController.getById);
router.post("/add", auth.checkRoles("user_add"), validate(addUserSchema), userController.addUser);
router.post("/update", auth.checkRoles("user_update"), validate(updateUserSchema), userController.updateUser);
router.post("/delete", auth.checkRoles("user_delete"), validate(deleteUserSchema), userController.deleteUser);

module.exports = router;
