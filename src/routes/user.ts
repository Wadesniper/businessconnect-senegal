import { Router } from 'express';
import { check } from 'express-validator';
import { userController } from '../controllers/userController';
import { auth } from '../middleware/auth';
import { ValidatorFunction } from '../types/express-validator';

const router = Router();

export const userValidation: ValidatorFunction[] = [
  check('email').isEmail().withMessage('Email invalide'),
  check('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// Routes publiques
router.post('/register', userValidation, userController.register);
router.post('/login', userValidation, userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

// Routes protégées
router.use(auth);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/password', userController.updatePassword);
router.delete('/account', userController.deleteAccount);

// Routes admin
router.get('/users', userController.getAllUsers);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router; 