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
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.send2FACodeEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"Admin Panel" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Giriş Kodunuz',
    text: `Oturum açmak için kodunuz: ${code}`,
  });
};
