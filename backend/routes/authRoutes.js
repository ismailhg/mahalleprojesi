const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const User = require("../models/User");

// ENV dosyasını içeri aktar
require("dotenv").config();

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

router.post("/sifremi-unuttum", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });

    const resetToken = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    user.resetToken = resetToken;
    user.resetTokenExpires = expires;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/#/sifre-sifirla/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Mahallem Uygulaması" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Şifre Sıfırlama Bağlantısı",
      html: `
        <p>Merhaba ${user.ad},</p>
        <p>Şifre sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Bağlantı 1 saat boyunca geçerlidir.</p>
      `,
    });

    res.json({
      message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
    });
  } catch (err) {
    console.error("E-posta gönderim hatası:", err);
    res.status(500).json({ error: "Sunucu hatası. E-posta gönderilemedi." });
  }
});

// Şifre sıfırlama işlemi (token ile gelen kullanıcı yeni şifresini girer)
+router.post("/sifre-sifirla/:token", async (req, res) => {
  const { token } = req.params;
  const { sifre } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Bağlantı geçersiz veya süresi dolmuş." });
    }

    const hashed = await bcrypt.hash(sifre, 10);
    user.sifre = hashed;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.json({ message: "Şifre başarıyla güncellendi." });
  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

module.exports = router;
