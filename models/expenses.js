const {DataTypes} = require('sequelize');
const database = require('../utilities/sql');
const Expense = database.define('Expense',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:true
});
module.exports = Expense;