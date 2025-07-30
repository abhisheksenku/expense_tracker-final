const userModel = require('../models/users');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const { sendMail } = require('../services/emailService');

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await userModel.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = jwt.sign({ UserId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
       

    await sendMail({
      toEmail: email,
      
      subject: 'Reset your password',
      html: `
        <p>Hello</p>
        <p>You requested to reset your password. It will be made in next task:</p>
        
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.status(200).json({ message: 'Reset link sent to email if account exists.' });
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  requestPasswordReset
};
