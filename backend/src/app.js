const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const createError = require("http-errors");
const routes = require("./routes");
const config = require("./config");

const app = express();

// 📦 Security Middlewares
app.use(helmet());

// 📦 CORS Config
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
}));

// 📦 HPP & XSS Protections
app.use(hpp());
app.use(xss());

// 📦 Rate Limiter
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS, // .env'den çekiyoruz
  max: config.RATE_LIMIT_MAX,             // .env'den çekiyoruz
  message: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin."
});
app.use(limiter);

// 📦 Parsing Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

// 📦 Routes
app.use("/api", routes);

// 📦 404 Not Found Handler
app.use((req, res, next) => {
  next(createError(404, "Aradığınız endpoint bulunamadı."));
});

// 📦 Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Sunucu hatası oluştu.",
  });
});

module.exports = app;
