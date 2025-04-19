const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");

// 🔐 Tüm route'lara authentication zorunluluğu
router.use(auth.authenticate());

// 🆕 Profile endpoint
router.get("/profile", async (req, res) => {
  try {
    // auth.authenticate middleware user'ı req.user içine koymalı
    const user = req.user;

    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    // Parola gibi hassas alanları dahil etme
    const { password, ...safeUser } = user.toObject ? user.toObject() : user;

    return res.status(200).json({ success: true, data: safeUser });
  } catch (err) {
    console.error("Profil getirilemedi:", err);
    return res.status(500).json({ success: false, message: "Profil bilgisi alınamadı" });
  }
});

// Diğer yetkili işlemler
router.get("/", auth.checkRoles("user_view"), userController.getAllUsers);
router.post("/add", auth.checkRoles("user_add"), userController.addUser);
router.post("/update", auth.checkRoles("user_update"), userController.updateUser);
router.post("/delete", auth.checkRoles("user_delete"), userController.deleteUser);

module.exports = router;
