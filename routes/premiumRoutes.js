const express = require('express');
const router = express.Router();
const userAuthenticate = require('../middleware/auth'); 
const premiumController = require('../controllers/premiumController')

router.get('/status',userAuthenticate.authenticate,premiumController.premiumStatus);

module.exports = router;