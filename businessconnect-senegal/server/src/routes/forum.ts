import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { ForumController } from '../controllers/forumController';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();
const forumController = new ForumController();

// Routes publiques
router.get('/topics', forumController.getAllTopics);
router.get('/topics/:id', forumController.getTopicById);
router.get('/topics/:id/posts', forumController.getPostsByTopic);

// Routes protégées
router.post(
  '/topics',
  authenticate,
  [
    body('title').trim().isLength({ min: 5 }).withMessage('Le titre doit contenir au moins 5 caractères'),
    body('description').trim().isLength({ min: 10 }).withMessage('La description doit contenir au moins 10 caractères'),
    body('category').trim().notEmpty().withMessage('La catégorie est requise'),
  ],
  validateRequest,
  forumController.createTopic
);

router.post(
  '/topics/:id/posts',
  authenticate,
  [
    body('content').trim().isLength({ min: 10 }).withMessage('Le contenu doit contenir au moins 10 caractères'),
  ],
  validateRequest,
  forumController.createPost
);

router.put(
  '/topics/:id',
  authenticate,
  [
    body('title').optional().trim().isLength({ min: 5 }).withMessage('Le titre doit contenir au moins 5 caractères'),
    body('description').optional().trim().isLength({ min: 10 }).withMessage('La description doit contenir au moins 10 caractères'),
  ],
  validateRequest,
  forumController.updateTopic
);

router.delete('/topics/:id', authenticate, forumController.deleteTopic);
router.delete('/posts/:id', authenticate, forumController.deletePost);

// Modération
router.post('/topics/:id/report', authenticate, forumController.reportTopic);
router.post('/posts/:id/report', authenticate, forumController.reportPost);

export { router as forumRouter }; 