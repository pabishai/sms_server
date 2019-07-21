'use strict';
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    contact: DataTypes.CHAR,
    password: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,    
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Contact, {
      as: 'contacts',
      foreignKey: 'userId'
    })
  };
  return User;
};