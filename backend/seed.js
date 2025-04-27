require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require('@faker-js/faker');

const Users = require("./src/models/Users");
const Roles = require("./src/models/Roles");
const RolePrivileges = require("./src/models/RolePrivileges");
const UserRoles = require("./src/models/UserRoles");

const { privileges } = require("./src/config/role_privileges");

const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

async function createRole(roleName, permissions = []) {
  let role = await Roles.findOne({ role_name: roleName });

  if (!role) {
    role = await Roles.create({ role_name: roleName, is_active: true });

    if (permissions.length > 0) {
      const rolePerms = permissions.map((perm) => ({
        role_id: role._id,
        permission: perm,
        created_by: null,
      }));
      await RolePrivileges.insertMany(rolePerms);
      console.log(`✅ Rol "${roleName}" için ${permissions.length} yetki eklendi.`);
    } else {
      console.log(`✅ Rol "${roleName}" oluşturuldu.`);
    }
  } else {
    console.log(`ℹ️ Rol "${roleName}" zaten mevcut.`);
  }

  return role;
}

async function createAdminUser(adminRoleId) {
  const existingAdmin = await Users.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log("⚠️ Admin kullanıcı zaten mevcut.");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const user = await Users.create({
    email: adminEmail,
    password: hashedPassword,
    is_active: true,
    first_name: "Admin",
    last_name: "User",
    phone_number: "+905555555555"
  });

  await UserRoles.create({
    user_id: user._id,
    role_id: adminRoleId,
  });

  console.log(`✅ Admin kullanıcı oluşturuldu: ${adminEmail}`);
}


async function createFakeUsers(count = 10) {
  const userRole = await Roles.findOne({ role_name: "USER" });
  if (!userRole) {
    console.error("❌ USER rolü bulunamadı. Sahte kullanıcılar oluşturulamadı.");
    return;
  }

  for (let i = 0; i < count; i++) {
    const email = faker.internet.email();
    const password = await bcrypt.hash("Password123!", 10);
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const phone_number = faker.phone.number();

    const user = await Users.create({
      email,
      password,
      is_active: true,
      first_name,
      last_name,
      phone_number,
    });

    await UserRoles.create({
      user_id: user._id,
      role_id: userRole._id,
    });

    console.log(`✅ Sahte kullanıcı oluşturuldu: ${email}`);
  }
}

async function seed() {
  try {
    console.log("⏳ MongoDB bağlantısı kuruluyor...");
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB bağlantısı başarılı.");

    // Roller
    const adminRole = await createRole("ADMIN", privileges.map(p => p.key));
    await createRole("USER", ["user_view"]);

    // Admin kullanıcı
    await createAdminUser(adminRole._id);

    // Faker verileri
    await createFakeUsers(10);

    console.log("🎉 Seed işlemi başarıyla tamamlandı.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed işlemi sırasında hata oluştu:", error);
    process.exit(1);
  }
}

seed();
