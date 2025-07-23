const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Il = sequelize.define(
  "Il",
  {
    il_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    il_adi: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "iller",
    timestamps: false,
  }
);

module.exports = Il;
