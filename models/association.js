const User = require('../models/users');
const Expense = require('../models/expenses');
const Order = require('../models/order');
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

module.exports = {
    User,Expense
};