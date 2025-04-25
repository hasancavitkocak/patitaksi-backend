// routes/driverRoutes.js
const express = require("express");
const router = express.Router();
const Driver = require("../models/Driver");

// Giriş veya kayıt
router.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Telefon gerekli" });

    let driver = await Driver.findOne({ phone });
    if (!driver) {
      driver = await Driver.create({ phone });
    }

    res.status(200).json({
      _id: driver._id,
      phone: driver.phone,
      status: driver.status,
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Durum güncelleme
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updated = await Driver.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Durum güncellenemedi" });
  }
});

module.exports = router;
