const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { addCustomerSchema, updateCustomerSchema, deleteCustomerSchema } = require("../validators/customer.validator");

router.use(auth.authenticate());

router.get("/", auth.checkRoles("customer_view"), customerController.getAll);
router.get("/:id", auth.checkRoles("customer_view"), customerController.getById);
router.get("/slug/:slug", auth.checkRoles("customer_view"), customerController.getBySlug);

router.post("/add", auth.checkRoles("customer_add"), validate(addCustomerSchema), customerController.add);
router.post("/update", auth.checkRoles("customer_update"), validate(updateCustomerSchema), customerController.update);
router.post("/delete", auth.checkRoles("customer_delete"), validate(deleteCustomerSchema), customerController.remove);

module.exports = router;
