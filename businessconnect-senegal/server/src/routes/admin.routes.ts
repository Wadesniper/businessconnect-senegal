import { Router } from 'express';
import { isAdmin, authMiddleware } from '../middleware/authMiddleware';
import { User } from '../models/User';
// Importe les modèles nécessaires pour jobs, subscriptions, etc. si existants

const router = Router();

// Toutes les routes admin sont protégées
router.use(authMiddleware, isAdmin);

// Liste des utilisateurs
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// TODO: Ajouter ici les routes jobs, subscriptions, statistics, forum, marketplace selon les modèles/disponibilité
// Exemple :
// router.get('/jobs', ...);
// router.get('/subscriptions', ...);
// router.get('/statistics', ...);
// router.get('/forum/posts', ...);
// router.get('/marketplace/items', ...);

export default router; 