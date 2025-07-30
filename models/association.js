const User = require('../models/users');
const Expense = require('../models/expenses');
const Order = require('../models/order');
const PasswordResetRequest = require('../models/passwordResetRequest');
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(PasswordResetRequest);
PasswordResetRequest.belongsTo(User);

module.exports = {
    User,Expense,Order,PasswordResetRequest
};