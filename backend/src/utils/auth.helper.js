const jwt = require("jsonwebtoken");
const config = require("../config");
const nodemailer = require("nodemailer");

exports.generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.signJWT = (payload) => {
  return jwt.sign(payload, config.JWT.SECRET, {
    expiresIn: config.JWT.EXPIRE_TIME,
  });
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.MAIL.USER,
    pass: config.MAIL.PASS,
  },
});

exports.send2FACodeEmail = async (to, code) => {

  try {
    await transporter.sendMail({
      from: config.MAIL.FROM || `"Admin Panel" <${config.MAIL.USER}>`,
      to,
      subject: 'Giriş Kodunuz',
      text: `Oturum açmak için kodunuz: ${code}`,
    });

  } catch (error) {
    console.error("[MAIL] Gönderim hatası:", error.message);
    throw new Error("Mail gönderimi başarısız oldu.");
  }
};
