'use strict';
module.exports = (sequelize, DataTypes) => {
  const sms = sequelize.define('sms', {
    sender: DataTypes.INTEGER,
    receiver: DataTypes.INTEGER,
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please enter a message'
        }
      }
    },
    status: DataTypes.ENUM('draft', 'sent', 'read'),
    readAt: DataTypes.DATE
  }, {});
  sms.associate = function(models) {
    // associations can be defined here
  };
  return sms;
};