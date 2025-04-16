const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    role_name: { type: String, required: true, unique: true },
    is_active: { type: Boolean, default: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("roles", RoleSchema);
