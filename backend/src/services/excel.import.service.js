const xlsx = require("node-xlsx");
const CustomError = require("../utils/CustomError");
const { HTTP_CODES } = require("../config/Enum");

class ImportService {
  fromExcel(filePath) {
    const workSheets = xlsx.parse(filePath);
    if (!workSheets || workSheets.length === 0) {
      throw new CustomError(HTTP_CODES.BAD_REQUEST, "Hatalı Excel", "Excel formatı geçersiz");
    }

    const rows = workSheets[0].data;
    if (!rows || rows.length === 0) {
      throw new CustomError(HTTP_CODES.NOT_ACCEPTABLE, "Boş Dosya", "Excel dosyası boş");
    }

    return rows;
  }
}

module.exports = new ImportService();
