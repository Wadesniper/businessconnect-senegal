"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const adController_1 = require("../controllers/adController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express.Router();
router.get('/', adController_1.adController.getAllAds);
router.get('/:id', adController_1.adController.getAdById);
router.use(authMiddleware_1.authMiddleware);
router.post('/', adController_1.adController.createAd);
router.put('/:id', adController_1.adController.updateAd);
router.delete('/:id', adController_1.adController.deleteAd);
exports.default = router;
//# sourceMappingURL=ads.js.map