'use strict';
module.exports = (sequelize, DataTypes) => {
  const HairColor = sequelize.define('HairColor', {
    color: DataTypes.STRING
  }, {});
  HairColor.associate = function(models) {
    HairColor.belongsTo(models.People, {
      foreignKey: "hairColorId"
    });
  };
  return HairColor;
};
