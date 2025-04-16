const multer = require("multer");
const config = require("../config");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "..", config.FILE_UPLOAD_PATH);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

module.exports = multer({ storage });
