const express = require('express');
const router = express.Router();
const { requestPasswordReset, updatePassword } = require('../controllers/forgotPasswordController');

router.post('/forgotpassword', requestPasswordReset);
router.post('/resetpassword/:token', updatePassword);
module.exports = router;
