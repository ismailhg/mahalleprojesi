const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Yorum = sequelize.define(
  "Yorum",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icerik: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    kullaniciId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ad: {
      type: DataTypes.STRING,
      allowNull: true, // zorunlu değil
    },
    soyad: {
      type: DataTypes.STRING,
      allowNull: true, // zorunlu değil
    },
    y_ilId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y_ilceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y_mahalleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tarih: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "yorumlar",
    timestamps: false,
  }
);

module.exports = Yorum;
