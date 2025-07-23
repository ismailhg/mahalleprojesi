const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Ilce = sequelize.define(
  "Ilce",
  {
    ilce_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    ilce_adi: {
      type: DataTypes.STRING,
    },
    i_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "ilceler",
    timestamps: false,
  }
);

module.exports = Ilce;
