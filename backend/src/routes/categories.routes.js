const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.use(auth.authenticate());

router.get("/", auth.checkRoles("category_view"), categoryController.getAll);
router.post("/add", auth.checkRoles("category_add"), categoryController.add);
router.post("/update", auth.checkRoles("category_update"), categoryController.update);
router.post("/delete", auth.checkRoles("category_delete"), categoryController.remove);
router.post("/export", auth.checkRoles("category_export"), categoryController.exportToExcel);
router.post("/import", upload.single("pb_file"), categoryController.importFromExcel);
router.get('/:id', auth.checkRoles("category_view"), categoryController.getById);

module.exports = router;
