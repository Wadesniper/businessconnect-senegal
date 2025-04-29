import { Router } from 'express';
import { forumController } from '../controllers/forumController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/', forumController.getDiscussions);
router.get('/:id', forumController.getDiscussion);

// Routes protégées
router.post('/', authMiddleware, forumController.createDiscussion);
router.post('/:id/replies', authMiddleware, forumController.addReply);
router.post('/:id/like', authMiddleware, forumController.likeDiscussion);
router.post('/:id/report', authMiddleware, forumController.reportDiscussion);

export default router; 