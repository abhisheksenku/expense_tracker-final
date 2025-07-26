const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.get('/fetch',userController.getUsers);
router.post('/add',userController.postUsers);
router.post('/login',userController.loginUser);
module.exports = router;