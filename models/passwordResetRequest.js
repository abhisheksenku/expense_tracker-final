const {DataTypes} = require('sequelize');
const database = require('../utilities/sql');
const PasswordResetRequest = database.define('PasswordResetRequest',{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
},{
  timestamps:true
});
module.exports = PasswordResetRequest;
