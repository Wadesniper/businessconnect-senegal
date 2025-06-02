"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes d'abonnement de base
router.get('/', auth_1.protect, (req, res) => {
    res.status(200).json({ message: 'Get subscriptions route' });
});
router.post('/subscribe', auth_1.protect, (req, res) => {
    res.status(200).json({ message: 'Subscribe route' });
});
exports.default = router;
//# sourceMappingURL=subscriptions.js.map