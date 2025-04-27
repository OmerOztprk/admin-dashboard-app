const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { DEFAULT_LANG } = require("../config");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_active: { type: Boolean, required: true },
    first_name: String,
    last_name: String,
    phone_number: String,
    language: { type: String, default: DEFAULT_LANG },

    // 🔐 Two-Factor Authentication alanları
    two_factor_code: { type: String, default: null },
    two_factor_expire: { type: Date, default: null }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

// Şifre doğrulama metodu
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("users", UserSchema);
