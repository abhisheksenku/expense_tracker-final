const User = require('../models/users');
const Expense = require('../models/expenses');

User.hasMany(Expense);
Expense.belongsTo(User);
module.exports = {
    User,Expense
};