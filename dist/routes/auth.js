"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes d'authentification de base
router.post('/login', (req, res) => {
    res.status(200).json({ message: 'Login route' });
});
router.post('/register', (req, res) => {
    res.status(200).json({ message: 'Register route' });
});
router.get('/me', auth_1.protect, (req, res) => {
    res.status(200).json({ message: 'Current user route' });
});
exports.default = router;
//# sourceMappingURL=auth.js.map