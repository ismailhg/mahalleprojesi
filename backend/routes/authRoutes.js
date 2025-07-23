const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Register endpoint
router.post("/register", async (req, res) => {
  const { ad, soyad, email, sifre, il_id, ilce_id, mahalle_id } = req.body;

  try {
    const mevcut = await User.findOne({ where: { email } });
    if (mevcut) {
      return res.status(400).json({ error: "Bu e-posta zaten kayıtlı." });
    }

    const hashedPassword = await bcrypt.hash(sifre, 10);
    const yeniKullanici = await User.create({
      ad,
      soyad,
      email,
      sifre: hashedPassword,
      il_id,
      ilce_id,
      mahalle_id,
    });

    res.status(201).json({ id: yeniKullanici.id, ad: yeniKullanici.ad });
  } catch (error) {
    console.error("Kayıt Hatası:", error);
    res.status(500).json({ error: "Kayıt olurken bir hata oluştu." });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, sifre } = req.body;

  try {
    const kullanici = await User.findOne({ where: { email } });
    if (!kullanici)
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });

    const sifreDogru = await bcrypt.compare(sifre, kullanici.sifre);
    if (!sifreDogru) return res.status(401).json({ error: "Şifre yanlış." });

    res.json({
      id: kullanici.id,
      ad: kullanici.ad,
      soyad: kullanici.soyad,
      email: kullanici.email,
      il_id: kullanici.il_id,
      ilce_id: kullanici.ilce_id,
      mahalle_id: kullanici.mahalle_id,
    });
  } catch (error) {
    console.error("Giriş Hatası:", error);
    res.status(500).json({ error: "Giriş yapılırken bir hata oluştu." });
  }
});

module.exports = router;
