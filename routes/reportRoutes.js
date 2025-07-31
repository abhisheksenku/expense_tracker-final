const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
router.get('/paginate',reportController.pagination);
module.exports = router;