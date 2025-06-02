"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middleware/validation");
const validateRequest_1 = require("../middleware/validateRequest");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Routes publiques
router.post('/register', validation_1.userValidation.create, validateRequest_1.validateRequest, userController_1.userController.register);
router.post('/login', validation_1.userValidation.create, validateRequest_1.validateRequest, userController_1.userController.login);
router.post('/forgot-password', userController_1.userController.forgotPassword);
router.post('/reset-password/:token', userController_1.userController.resetPassword);
// Routes protégées
router.use(authMiddleware_1.authMiddleware.authenticate);
router.get('/profile', userController_1.userController.getProfile);
router.put('/profile', validation_1.userValidation.update, validateRequest_1.validateRequest, userController_1.userController.updateProfile);
router.delete('/profile', userController_1.userController.deleteProfile);
router.put('/password', userController_1.userController.updatePassword);
router.delete('/account', userController_1.userController.deleteAccount);
// Routes admin
router.use(authMiddleware_1.authMiddleware.isAdmin);
router.get('/users', userController_1.userController.getAllUsers);
router.put('/users/:id', userController_1.userController.updateUser);
router.delete('/users/:id', userController_1.userController.deleteUser);
exports.default = router;
//# sourceMappingURL=user.js.map