const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const validate = require("../middlewares/validate.middleware");
const { addCategorySchema, updateCategorySchema, deleteCategorySchema } = require("../validators/category.validator");

router.use(auth.authenticate());

router.get("/", auth.checkRoles("category_view"), categoryController.getAll);
router.get("/:id", auth.checkRoles("category_view"), categoryController.getById);

router.post("/add", auth.checkRoles("category_add"), validate(addCategorySchema), categoryController.add);
router.post("/update", auth.checkRoles("category_update"), validate(updateCategorySchema), categoryController.update);
router.post("/delete", auth.checkRoles("category_delete"), validate(deleteCategorySchema), categoryController.remove);

router.post("/export", auth.checkRoles("category_export"), categoryController.exportToExcel);
router.post("/import", upload.single("pb_file"), categoryController.importFromExcel);

module.exports = router;
