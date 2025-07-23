const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Mahalle = sequelize.define(
  "Mahalle",
  {
    mahalle_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    mahalle_adi: {
      type: DataTypes.STRING,
    },
    ilce_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "mahalleler",
    timestamps: false,
  }
);

module.exports = Mahalle;
