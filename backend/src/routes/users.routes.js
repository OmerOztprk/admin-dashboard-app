const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");

router.use(auth.authenticate());

router.get("/", auth.checkRoles("user_view"), userController.getAllUsers);
router.post("/add", auth.checkRoles("user_add"), userController.addUser);
router.post("/update", auth.checkRoles("user_update"), userController.updateUser);
router.post("/delete", auth.checkRoles("user_delete"), userController.deleteUser);

module.exports = router;
