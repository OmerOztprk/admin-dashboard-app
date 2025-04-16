const AuditLogs = require("../models/AuditLogs");
const Enum = require("../config/Enum");

class AuditService {
  static async info(email, location, proc_type, log) {
    return this.saveToDB("INFO", email, location, proc_type, log);
  }

  static async warn(email, location, proc_type, log) {
    return this.saveToDB("WARN", email, location, proc_type, log);
  }

  static async error(email, location, proc_type, log) {
    return this.saveToDB("ERROR", email, location, proc_type, log);
  }

  static async debug(email, location, proc_type, log) {
    return this.saveToDB("DEBUG", email, location, proc_type, log);
  }

  static async saveToDB(level, email, location, proc_type, log) {
    try {
      await AuditLogs.create({
        level,
        email,
        location,
        proc_type,
        log
      });
    } catch (err) {
      console.error("Audit log kayıt hatası:", err.message);
    }
  }
}

module.exports = AuditService;
