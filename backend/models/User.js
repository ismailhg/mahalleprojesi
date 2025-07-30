const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soyad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    sifre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    il_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ilce_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mahalle_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "kullanicilar",
    timestamps: false,
  }
);

module.exports = User;
