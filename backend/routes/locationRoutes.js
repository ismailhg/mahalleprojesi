const express = require("express");
const router = express.Router();
const Il = require("../models/Il");
const Ilce = require("../models/Ilce");
const Mahalle = require("../models/Mahalle");

// /api/location/iller
router.get("/iller", async (req, res) => {
  try {
    const iller = await Il.findAll({
      attributes: [
        ["il_id", "id"],
        ["il_adi", "ad"],
      ],
      order: [["il_adi", "ASC"]],
    });
    res.json(iller);
  } catch (err) {
    console.error("🔥 İl verisi hatası:", err);
    res.status(500).json({ error: "İller alınamadı." });
  }
});

// /api/location/ilceler?ilId=1
router.get("/ilceler", async (req, res) => {
  const { ilId } = req.query;
  try {
    const ilceler = await Ilce.findAll({
      where: { il_id: ilId },
      attributes: [
        ["ilce_id", "id"],
        ["ilce_adi", "ad"],
      ],
      order: [["ilce_adi", "ASC"]],
    });
    res.json(ilceler);
  } catch (err) {
    console.error("🔥 İlçe verisi hatası:", err);
    res.status(500).json({ error: "İlçeler alınamadı." });
  }
});

// /api/location/mahalleler?ilceId=1104
router.get("/mahalleler", async (req, res) => {
  const { ilceId } = req.query;
  try {
    const mahalleler = await Mahalle.findAll({
      where: { ilce_id: ilceId },
      attributes: [
        ["mahalle_id", "id"],
        ["mahalle_adi", "ad"],
      ],
      order: [["mahalle_adi", "ASC"]],
    });
    res.json(mahalleler);
  } catch (err) {
    console.error("🔥 Mahalle verisi hatası:", err);
    res.status(500).json({ error: "Mahalleler alınamadı." });
  }
});

module.exports = router;
