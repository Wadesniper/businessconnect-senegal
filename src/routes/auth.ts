import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

// Routes d'authentification de base
router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Login route' });
});

router.post('/register', (req, res) => {
  res.status(200).json({ message: 'Register route' });
});

router.get('/me', protect, (req, res) => {
  res.status(200).json({ message: 'Current user route' });
});

export default router; 