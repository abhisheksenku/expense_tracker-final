const {DataTypes}= require('sequelize');
const database = require('../utilities/sql');
const User = database.define('User',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    totalExpenses: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
},{
    timestamps:true
});
module.exports = User;