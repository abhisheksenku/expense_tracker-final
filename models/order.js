const { DataTypes } = require('sequelize');
const database = require('../utilities/sql');

const Order = database.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'SUCCESSFUL', 'FAILED'),
        allowNull: false,
        defaultValue: 'PENDING',
    },
});
module.exports = Order