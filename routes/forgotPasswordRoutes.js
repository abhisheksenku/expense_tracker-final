const express = require('express');
const router = express.Router();
const { requestPasswordReset } = require('../controllers/forgotPasswordController');

router.post('/forgotpassword', requestPasswordReset);

module.exports = router;
