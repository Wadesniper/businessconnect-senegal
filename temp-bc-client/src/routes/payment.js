const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/init', paymentController.initPayment);
router.post('/notify', paymentController.cinetpayNotify);
router.get('/status', paymentController.getPaymentStatus);

module.exports = router; 