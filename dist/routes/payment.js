"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes de paiement de base
router.post('/initiate', auth_1.protect, (req, res) => {
    res.status(200).json({ message: 'Payment initiation route' });
});
router.post('/webhook', (req, res) => {
    res.status(200).json({ message: 'Payment webhook route' });
});
exports.default = router;
//# sourceMappingURL=payment.js.map