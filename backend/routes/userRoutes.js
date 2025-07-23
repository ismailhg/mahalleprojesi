// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Kullanıcı bilgilerini getir
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "ad",
        "soyad",
        "email",
        "il_id",
        "ilce_id",
        "mahalle_id",
      ],
    });
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Kullanıcı bilgisi alınamadı." });
  }
});

// Kullanıcı bilgilerini güncelle
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ad, soyad, email, il_id, ilce_id, mahalle_id } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    await user.update({ ad, soyad, email, il_id, ilce_id, mahalle_id });
    res.json({ message: "Kullanıcı başarıyla güncellendi." });
  } catch (error) {
    res.status(500).json({ error: "Güncelleme sırasında hata oluştu." });
  }
});

module.exports = router;
