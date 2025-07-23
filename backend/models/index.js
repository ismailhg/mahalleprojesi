const User = require("./User");
const Yorum = require("./Yorum");
const Il = require("./Il");
const Ilce = require("./Ilce");
const Mahalle = require("./Mahalle");

// İlişkileri tanımla
Yorum.belongsTo(User, { foreignKey: "kullaniciId" });
Yorum.belongsTo(Il, { foreignKey: "y_ilId", as: "yorumIl" });
Yorum.belongsTo(Ilce, { foreignKey: "y_ilceId", as: "yorumIlce" });
Yorum.belongsTo(Mahalle, { foreignKey: "y_mahalleId", as: "yorumMahalle" });

User.hasMany(Yorum, { foreignKey: "kullaniciId" });

module.exports = {
  User,
  Yorum,
  Il,
  Ilce,
  Mahalle,
};
