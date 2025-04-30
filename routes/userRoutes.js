const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // JWT eklendi
const User = require("../models/User");

const DUMMY_CODE = "1234";

router.post("/login", async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ message: "Telefon numarası ve doğrulama kodu gerekli." });
  }

  if (code !== DUMMY_CODE) {
    return res.status(401).json({ message: "Kod hatalı." });
  }

  try {
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone });
    }

    // ✅ Token üret
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "gizliAnahtar123", {
      expiresIn: "7d", // 7 gün geçerli olacak
    });

    res.status(200).json({
      message: "Giriş başarılı",
      userId: user._id,
      token, // ✅ Frontend'e gönder
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
