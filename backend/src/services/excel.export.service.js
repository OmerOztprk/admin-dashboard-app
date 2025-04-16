const xlsx = require("node-xlsx");

class ExportService {
  /**
   * @param {Array} headers Excel başlıkları (örn: ["NAME", "IS ACTIVE?"])
   * @param {Array} fields Objede karşılık gelen alanlar (örn: ["name", "is_active"])
   * @param {Array} data Veriler
   */
  toExcel(headers, fields, data = []) {
    const rows = [headers];

    for (const item of data) {
      const row = fields.map(field => item[field]);
      rows.push(row);
    }

    return xlsx.build([{ name: "Sheet1", data: rows }]);
  }
}

module.exports = new ExportService();
