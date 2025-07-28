const User = require('../models/users');
const Expense = require('../models/expenses');
const { fn, col } = require('sequelize');
const sequelize = require('../utilities/sql');
const premiumStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ isPremium: user.isPremium });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch premium status" });
  }
};
const optimizedLeader = async (req, res) => {
  try {
    const leaderBoard = await Expense.findAll({
      attributes: [
        'UserId',
        [fn('SUM', col('amount')), 'total_spent']
      ],
      include: [{
        model: User,
        attributes: ['name']
      }],
      group: ['UserId'],
      order: [[sequelize.literal('total_spent'), 'DESC']]
    });

    res.status(200).json(leaderBoard); 
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Failed to generate leaderboard" });
  }
};


module.exports = {
    premiumStatus,
    optimizedLeader
}