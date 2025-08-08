const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const userAuthenticate = require('../middleware/auth');
router.get('/paginate',userAuthenticate.authenticate,reportController.pagination);
module.exports = router;