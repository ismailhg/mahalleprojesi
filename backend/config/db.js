const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     // mahalle_rehberi
  process.env.DB_USER,     // root
  process.env.DB_PASS,     // (şifre varsa)
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,        // terminale sorgu basmasın
  }
);

// Bağlantıyı test et
sequelize.authenticate()
  .then(() => console.log("✅ Veritabanına başarıyla bağlanıldı."))
  .catch((err) => console.error("❌ Veritabanı bağlantı hatası:", err));

module.exports = sequelize;
