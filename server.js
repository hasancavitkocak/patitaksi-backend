const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// 📋 Gelen her isteği logla (test için)
app.use((req, res, next) => {
  console.log(`📲 İstek geldi: ${req.method} ${req.url}`);
  next();
});

// 👉 ROTAYI EN ÜSTE AL
const petRoutes = require("./routes/petRoutes");
const userRoutes = require("./routes/userRoutes"); // buraya taşı
app.use("/api/pets", petRoutes);
app.use("/api/users", userRoutes); // ve burada kullan

app.get("/", (req, res) => {
  res.send("PatiTaksi sunucusu çalışıyor 🚕🐾");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB bağlantısı başarılı");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Sunucu çalışıyor: http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB bağlantı hatası:", err);
  });
