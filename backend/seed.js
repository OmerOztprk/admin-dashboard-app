require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Users = require("./src/models/Users");
const Roles = require("./src/models/Roles");
const RolePrivileges = require("./src/models/RolePrivileges");
const UserRoles = require("./src/models/UserRoles");

const { privileges } = require("./src/config/role_privileges");

(async () => {
  try {
    console.log("⏳ MongoDB bağlantısı kuruluyor...");
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Bağlantı başarılı.");

    // ====== ADMIN Rolü ======
    let adminRole = await Roles.findOne({ role_name: "ADMIN" });
    if (!adminRole) {
      adminRole = await Roles.create({
        role_name: "ADMIN",
        is_active: true,
      });

      const allPerms = privileges.map((p) => ({
        role_id: adminRole._id,
        permission: p.key,
        created_by: null,
      }));

      await RolePrivileges.insertMany(allPerms);
      console.log(`✅ ADMIN için ${privileges.length} yetki eklendi.`);
    }

    // ====== USER Rolü ======
    let userRole = await Roles.findOne({ role_name: "USER" });
    if (!userRole) {
      userRole = await Roles.create({
        role_name: "USER",
        is_active: true,
      });

      await RolePrivileges.create({
        role_id: userRole._id,
        permission: "user_view",
        created_by: null,
      });

      console.log("✅ USER rolü oluşturuldu.");
    }

    // ====== Admin Kullanıcı ======
    const adminEmail = "admin@example.com";
    const existingUser = await Users.findOne({ email: adminEmail });

    if (!existingUser) {
      const hashed = await bcrypt.hash("Admin123!", 10);
      const user = await Users.create({
        email: adminEmail,
        password: hashed,
        is_active: true,
        first_name: "Admin",
        last_name: "User",
      });

      await UserRoles.create({
        role_id: adminRole._id,
        user_id: user._id,
      });

      console.log("✅ Admin kullanıcı oluşturuldu.");
    } else {
      console.log("⚠️ Admin kullanıcı zaten mevcut.");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Hata oluştu:", err);
    process.exit(1);
  }
})();
