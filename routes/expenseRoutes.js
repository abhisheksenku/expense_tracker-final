const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const userAuthenticate = require('../middleware/auth');
router.get('/fetch',userAuthenticate.authenticate,expenseController.getExpenses);
router.post('/add',userAuthenticate.authenticate,expenseController.postExpenses);
router.delete('/delete/:id',userAuthenticate.authenticate,expenseController.deleteExpenses);
module.exports = router;