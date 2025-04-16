const mongoose = require("mongoose");

const UserRoleSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "roles", required: true }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("user_roles", UserRoleSchema);
