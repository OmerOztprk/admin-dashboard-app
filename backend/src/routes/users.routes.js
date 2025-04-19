const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");

// 🔐 Tüm route'lara authentication zorunluluğu
router.use(auth.authenticate());

// 🆕 Profile endpoint
router.get("/profile", async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: "Kullanıcı bulunamadı",
        data: null,
      });
    }

    const { password, ...safeUser } = user.toObject ? user.toObject() : user;

    return res.status(200).json({
      code: 200,
      success: true,
      message: "Profil başarıyla alındı",
      data: safeUser,
    });
  } catch (err) {
    console.error("Profil getirilemedi:", err);
    return res.status(500).json({
      code: 500,
      success: false,
      message: "Profil bilgisi alınamadı",
      data: null,
    });
  }
});

// Diğer yetkili işlemler
router.get("/", auth.checkRoles("user_view"), userController.getAllUsers);
router.post("/add", auth.checkRoles("user_add"), userController.addUser);
router.post(
  "/update",
  auth.checkRoles("user_update"),
  userController.updateUser
);
router.post(
  "/delete",
  auth.checkRoles("user_delete"),
  userController.deleteUser
);
router.get("/:id", auth.checkRoles("user_view"), userController.getById); // bu satırı en sonlara yaz

module.exports = router;
