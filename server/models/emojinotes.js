'use strict';
module.exports = (sequelize, DataTypes) => {
  const Emojinotes = sequelize.define('Emojinotes', {
    emoji: DataTypes.STRING,
    note: DataTypes.STRING,
    token: DataTypes.STRING
  }, {});
  Emojinotes.associate = function(models) {
    // associations can be defined here
  };
  return Emojinotes;
};