const Users      = require('../models/Users');
const Roles      = require('../models/Roles');
const UserRoles  = require('../models/UserRoles');
const bcrypt     = require('bcryptjs');
const Response   = require('../utils/Response');
const CustomError= require('../utils/CustomError');
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/* ------------------ Yardımcılar ------------------ */
const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* Gmail (App Password) → TLS/465 */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER, // örn. you@gmail.com
    pass: process.env.MAIL_PASS  // 16 haneli App Password
  }
});

/* ------------------ REGISTER ------------------ */
exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone_number } = req.body;

    if (!email || !password)
      throw new CustomError(400, 'Geçersiz istek', 'Email ve şifre zorunludur');

    if (await Users.findOne({ email }))
      throw new CustomError(409, 'Zaten kayıtlı', 'Bu email zaten kullanılıyor');

    const hashed = await bcrypt.hash(password, 10);

    const user = await Users.create({
      email,
      password: hashed,
      is_active: true,
      first_name,
      last_name,
      phone_number
    });

    /* USER rolü ata */
    const role = await Roles.findOne({ role_name: 'USER' });
    if (role) await UserRoles.create({ role_id: role._id, user_id: user._id });

    return res.status(201).json(Response.success({ success: true }, 201));
  } catch (err) {
    const status = typeof err.code === 'number' ? err.code : 500;
    return res.status(status).json(Response.error(err));
  }
};

/* ------------------ LOGIN ------------------ */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new CustomError(400, 'Geçersiz istek', 'Email ve şifre zorunludur');

    const user = await Users.findOne({ email });
    if (!user)
      throw new CustomError(401, 'Kimlik doğrulama hatası', 'Kullanıcı bulunamadı');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new CustomError(401, 'Kimlik doğrulama hatası', 'Şifre yanlış');

    /* 2FA kodu üret & kaydet */
    const code = generateCode();
    user.two_factor_code   = code;
    user.two_factor_expire = Date.now() + 5 * 60 * 1000; // 5 dk
    await user.save();

    /* Mail gönder; hata olursa CustomError fırlat */
    try {
      await transporter.sendMail({
        from: `"Admin Panel" <${process.env.MAIL_USER}>`,
        to:   user.email,
        subject: 'Giriş Kodunuz',
        text:    `Oturum açmak için kodunuz: ${code}`
      });
    } catch (mailErr) {
      console.error('[MAIL] Gönderilemedi:', mailErr);
      throw new CustomError(
        500,
        'Mail Gönderilemedi',
        'Doğrulama kodu e-posta ile iletilemedi.'
      );
    }

    return res.json(Response.success({ step: '2fa', userId: user._id }));
  } catch (err) {
    const status = typeof err.code === 'number' ? err.code : 500;
    return res.status(status).json(Response.error(err));
  }
};

/* ------------------ VERIFY CODE ------------------ */
exports.verifyCode = async (req, res) => {
  try {
    const { userId, code } = req.body;
    const user = await Users.findById(userId);

    const expired = Date.now() > user?.two_factor_expire;
    if (!user || user.two_factor_code !== code || expired)
      throw new CustomError(401, 'Kod Geçersiz', 'Kod yanlış veya süresi dolmuş');

    /* Kod doğrulandı → sıfırla */
    user.two_factor_code   = null;
    user.two_factor_expire = null;
    await user.save();

    /* JWT üret */
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: isNaN(process.env.TOKEN_EXPIRE_TIME)
          ? process.env.TOKEN_EXPIRE_TIME
          : parseInt(process.env.TOKEN_EXPIRE_TIME, 10)
      }
    );

    const userData = {
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name : user.last_name
    };

    return res.json(Response.success({ token, user: userData }));
  } catch (err) {
    const status = typeof err.code === 'number' ? err.code : 500;
    return res.status(status).json(Response.error(err));
  }
};
