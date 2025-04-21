const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");
const auth = require("../middleware/auth");

// 👉 Sadece giriş yapan kullanıcının petlerini getir
router.get("/", auth, async (req, res) => {
  const pets = await Pet.find({ userId: req.userId });
  res.json(pets);
});

// 👉 Giriş yapan kullanıcı için yeni pet kaydı
router.post("/", auth, async (req, res) => {
  const { name, type } = req.body;
  const pet = await Pet.create({ name, type, userId: req.userId });
  res.status(201).json(pet);
});

router.delete("/:id", auth, async (req, res) => {
    const { id } = req.params;
  
    try {
      const pet = await Pet.findOneAndDelete({ _id: id, userId: req.userId });
      if (!pet) return res.status(404).json({ message: "Pet bulunamadı" });
      res.json({ message: "Pet silindi" });
    } catch (err) {
      res.status(500).json({ message: "Silme hatası", error: err.message });
    }
  });
  

  router.put("/:id", auth, async (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;
  
    try {
      const pet = await Pet.findOneAndUpdate(
        { _id: id, userId: req.userId },
        { name, type },
        { new: true }
      );
  
      if (!pet) return res.status(404).json({ message: "Pet bulunamadı" });
      res.json(pet);
    } catch (err) {
      res.status(500).json({ message: "Güncelleme hatası", error: err.message });
    }
  });
  
  

module.exports = router;
