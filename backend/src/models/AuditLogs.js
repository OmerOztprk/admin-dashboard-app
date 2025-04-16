const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    level: String,
    email: String,
    location: String,
    proc_type: String,
    log: mongoose.Schema.Types.Mixed
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("audit_logs", AuditLogSchema);
