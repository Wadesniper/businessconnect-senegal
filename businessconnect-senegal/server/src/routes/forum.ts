import { Router } from 'express';
import { forumController } from '../controllers/forumController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Routes publiques
router.get('/discussions', forumController.getDiscussions);
router.get('/discussions/:id', forumController.getDiscussion);

// Routes protégées
router.post('/discussions', authMiddleware, forumController.createDiscussion);
router.post('/discussions/:id/replies', authMiddleware, forumController.addReply);
router.post('/discussions/:id/like', authMiddleware, forumController.likeDiscussion);
router.post('/discussions/:id/report', authMiddleware, forumController.reportDiscussion);

export default router; 