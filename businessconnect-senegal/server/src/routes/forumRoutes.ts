import { Router } from 'express';
import { ForumController } from '../controllers/forumController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const forumController = new ForumController();

// Routes publiques
router.get('/', forumController.listTopics);
router.get('/:id', forumController.getTopic);

// Routes protégées
router.post('/', authMiddleware, forumController.createTopic);
router.post('/:id/replies', authMiddleware, forumController.addPost);
router.post('/:id/like', authMiddleware, forumController.toggleLike);
router.post('/:id/report', authMiddleware, forumController.reportTopic);

export default router; 