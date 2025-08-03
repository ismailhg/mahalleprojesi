const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const sequelize = require("../config/db"); // sequelize örneği
const { Yorum, User, Il, Ilce, Mahalle } = require("../models");

// 1. Ana sayfa için tüm yorumları getir (rastgele)
router.get("/", async (req, res) => {
  try {
    const yorumlar = await Yorum.findAll({
      include: [
        { model: User, attributes: ["ad"] },
        { model: Il, attributes: ["il_adi"], as: "yorumIl" },
        { model: Ilce, attributes: ["ilce_adi"], as: "yorumIlce" },
        { model: Mahalle, attributes: ["mahalle_adi"], as: "yorumMahalle" },
      ],
      order: sequelize.random(),
      limit: 100,
    });

    res.json(yorumlar);
  } catch (err) {
    console.error("Yorumlar alınamadı:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 2. Benim mahallem - sadece kullanıcıya özel yorumlar
router.get("/my-mahalle/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);
    if (!user || !user.mahalle_id) {
      return res
        .status(404)
        .json({ error: "Kullanıcı ya da mahalle bulunamadı." });
    }

    const yorumlar = await Yorum.findAll({
      where: { y_mahalleId: user.mahalle_id },
      include: [
        { model: User, attributes: ["ad"] },
        { model: Il, attributes: ["il_adi"], as: "yorumIl" },
        { model: Ilce, attributes: ["ilce_adi"], as: "yorumIlce" },
        { model: Mahalle, attributes: ["mahalle_adi"], as: "yorumMahalle" },
      ],
      order: [["tarih", "DESC"]],
    });

    res.json(yorumlar);
  } catch (err) {
    console.error("Yorumlar alınamadı:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 3. Yorum gönderme
router.post("/", async (req, res) => {
  const {
    kategori,
    icerik,
    kullaniciId,
    y_ilId,
    y_ilceId,
    y_mahalleId,
    ad,
    soyad,
  } = req.body;

  if (
    !kategori ||
    !icerik ||
    !kullaniciId ||
    !y_ilId ||
    !y_ilceId ||
    !y_mahalleId
  ) {
    return res.status(400).json({ error: "Tüm alanlar zorunludur." });
  }

  try {
    const yeniYorum = await Yorum.create({
      kategori,
      icerik,
      kullaniciId,
      ad,
      soyad,
      y_ilId,
      y_ilceId,
      y_mahalleId,
      tarih: new Date(),
    });

    res.status(201).json(yeniYorum);
  } catch (err) {
    console.error("Yorum kaydedilemedi:", err);
    res.status(500).json({ error: "Yorum kaydedilemedi." });
  }
});

// 4. Yorum silme
router.delete("/:id", async (req, res) => {
  const yorumId = req.params.id;
  const { kullaniciId } = req.body;

  if (!kullaniciId) {
    return res.status(400).json({ error: "Kullanıcı ID gerekli." });
  }

  try {
    const yorum = await Yorum.findByPk(yorumId);

    if (!yorum) {
      return res.status(404).json({ error: "Yorum bulunamadı." });
    }

    if (yorum.kullaniciId !== kullaniciId) {
      return res.status(403).json({ error: "Bu yorumu silme yetkiniz yok." });
    }

    await yorum.destroy();
    res.json({ message: "Yorum başarıyla silindi." });
  } catch (err) {
    console.error("Yorum silinemedi:", err);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

module.exports = router;
