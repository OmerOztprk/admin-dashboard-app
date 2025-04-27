const yup = require("yup");

// Yup Şemaları
const loginSchema = yup.object({
  email: yup.string().email("Geçerli bir email giriniz").required("Email zorunludur."),
  password: yup.string().min(6, "Şifre en az 6 karakter olmalı").required("Şifre zorunludur."),
});

const registerSchema = yup.object({
  email: yup.string().email("Geçerli bir email giriniz").required("Email zorunludur."),
  password: yup.string().min(6, "Şifre en az 6 karakter olmalı").required("Şifre zorunludur."),
  first_name: yup.string().required("İsim zorunludur."),
  last_name: yup.string().required("Soyisim zorunludur."),
  phone_number: yup.string().nullable(),
});

const verifyCodeSchema = yup.object({
  userId: yup.string().required("Kullanıcı ID zorunludur."),
  code: yup.string().length(6, "Kod 6 haneli olmalıdır").required("Kod zorunludur."),
});

// Manuel Validasyon Fonksiyonu
function validateAuthFields(email, password) {
  if (typeof password !== "string" || password.length < 8) {
    throw new Error("Şifre en az 8 karakter olmalıdır.");
  }
  if (!email.includes("@")) {
    throw new Error("Geçersiz email adresi.");
  }
}

module.exports = {
  loginSchema,
  registerSchema,
  verifyCodeSchema,
  validateAuthFields
};
