const {DataTypes} = require('sequelize');
const database = require('../utilities/sql');
const Expense = database.define('Expense',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull:false
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
    },
    income:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true
    }

},{
    timestamps:true
});
module.exports = Expense;