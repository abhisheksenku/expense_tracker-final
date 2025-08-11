const userModel = require('../models/users');
const PassWordResetRequest = require('../models/passwordResetRequest');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();
require('dotenv').config({ path: '/var/configs/expensetrackingapp/.env' });

const { sendMail } = require('../services/emailService');

const { v4: uuidv4 } = require('uuid');

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await userModel.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // const token = jwt.sign({ UserId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const token = uuidv4();
    await PassWordResetRequest.create({
        id:token,
        UserId:user.id

    })
    const resetLink = `http://65.2.33.7:3000/password/resetpassword/${token}`;

    sendMail({
      toEmail: email,

      subject: 'Reset your password',
      html: `
        <p>Hello</p>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `,
      text: `Visit the following link to reset your password: ${resetLink}`,
    });

    res.status(200).json({ message: 'Reset link sent to email if account exists.' });
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const updatePassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await userModel.findByPk(decoded.UserId);
    const resetRequest = await PassWordResetRequest.findOne({
      where: { id: token, isActive: true }
    });

    if (!resetRequest) return res.status(404).json({ error: 'Token expired' });
    const user = await userModel.findByPk(resetRequest.UserId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    // Invalidate the token
    resetRequest.isActive = false;
    await resetRequest.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = {
  requestPasswordReset,
  updatePassword
};
