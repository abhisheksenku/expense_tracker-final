const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
router.get('/fetch',expenseController.getExpenses);
router.post('/add',expenseController.postExpenses);
router.delete('/delete/:id',expenseController.deleteExpenses);
module.exports = router;