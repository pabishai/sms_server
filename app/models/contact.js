'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'cannot be empty'
        },
        len: {
          args: [2, 255],
          msg: 'number has to have at least 2 characters and a max of 255'
        }
      }
    },
    phoneNumber: {
      type: DataTypes.CHAR,
      allowNull: false,
      validate: {
        notNull: {
          mgs: 'Please put in a phone number'
        },
        notEmpty: {
          args: true,
          msg: 'cannot be empty'
        },
        len: {
          args: [10,10],
          msg: 'number has to be ten characterd'
        }
      }
    },
    userId:  DataTypes.INTEGER,
    isUserContact: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {});
  Contact.associate = function(models) {
    // associations can be defined here
    Contact.hasMany(models.sms, {
      as: 'sentMessages',
      foreignKey: 'sender'
    })
    Contact.hasMany(models.sms, {
      as: 'receivedMessages',
      foreignKey: 'receiver'
    })
    Contact.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    })
  };
  return Contact;
};