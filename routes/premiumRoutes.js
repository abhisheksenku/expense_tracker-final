const express = require('express');
const router = express.Router();
const userAuthenticate = require('../middleware/auth'); 
const premiumController = require('../controllers/premiumController')

router.get('/status',userAuthenticate.authenticate,premiumController.premiumStatus);
router.get('/leaderBoard',userAuthenticate.authenticate,premiumController.optimizedLeader);
module.exports = router;