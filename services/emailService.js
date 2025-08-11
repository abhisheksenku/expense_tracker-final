// require('dotenv').config();
require('dotenv').config({ path: '/var/configs/expensetrackingapp/.env' });

const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port: 465,
    auth:{
        user:process.env.MAIL,
        pass:process.env.MAIL_PASSWORD
    }
});
function sendMail({ toEmail, subject, html, text }) {
  transporter.sendMail({
    from: process.env.MAIL,
    to: toEmail,
    subject,
    html,
    text
  }, (err, info) => {
    if (err) console.error('Email error:', err);
    else console.log('Email sent:', info.response);
  });
}

module.exports = {sendMail};