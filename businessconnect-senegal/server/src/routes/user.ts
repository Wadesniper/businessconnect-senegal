import express from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const userController = new UserController();

// Routes publiques
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('name').not().isEmpty().withMessage('Le nom est requis'),
  ],
  userController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').exists().withMessage('Le mot de passe est requis'),
  ],
  userController.login
);

// Routes protégées
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/password', authMiddleware, userController.updatePassword);

// Routes admin
router.get('/admin/users', authMiddleware, userController.getAllUsers);
router.put('/admin/users/:id', authMiddleware, userController.updateUser);
router.delete('/admin/users/:id', authMiddleware, userController.deleteUser);

export default router; 