const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

router.get('/', adController.getAllAds);
router.post('/', adController.createAd);
router.get('/:id', adController.getAdById);

module.exports = router; 