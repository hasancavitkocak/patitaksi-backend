const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// JWT oluşturma fonksiyonu
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 📌 Kayıt Olma (POST /api/users/register)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı." });
    }

    const user = await User.create({ name, email, password });
    const token = createToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Kayıt başarısız.", error: err.message });
  }
});

// 📌 Giriş Yapma (POST /api/users/login)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Şifre yanlış." });
    }

    const token = createToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (err) {
    res.status(500).json({ message: "Giriş başarısız.", error: err.message });
  }
});

// 📌 Kullanıcı Adı Güncelleme (PUT /api/users/:id)
router.put("/:id", async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    user.name = name || user.name;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (err) {
    console.error("❌ Kullanıcı güncelleme hatası:", err);
    res.status(500).json({ message: "Güncelleme başarısız.", error: err.message });
  }
});

module.exports = router;
