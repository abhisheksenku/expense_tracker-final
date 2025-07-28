const express = require('express');
const router = express.Router();
const userAuthenticate = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

router.post('/payment',userAuthenticate.authenticate, paymentController.handleCreateOrder);
router.get('/payment-status/:orderId',userAuthenticate.authenticate, paymentController.handlePaymentStatus);
router.post('/payment-success',userAuthenticate.authenticate, paymentController.handlePaymentSuccess);
router.post('/payment-failed',userAuthenticate.authenticate, paymentController.handlePaymentFailed);

module.exports = router;
