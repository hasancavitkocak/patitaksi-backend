const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Dummy şifre
const DUMMY_CODE = "1234";

// Telefon numarasıyla kayıt veya giriş
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
      user = await User.create({ phone }); // yeni kullanıcı oluştur
    }

    res.status(200).json({ message: "Giriş başarılı", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
