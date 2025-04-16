// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const createError = require("http-errors");
const routes = require("./routes");

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api", routes);

// 404
app.use((req, res, next) => {
  next(createError(404, "Aradığınız endpoint bulunamadı."));
});

// Global Error
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Sunucu hatası oluştu.",
  });
});

module.exports = app;
