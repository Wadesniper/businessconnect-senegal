import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { ForumController } from '../controllers/forumController';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const forumController = new ForumController();

// Routes du forum
router.get('/', authenticate, forumController.getAllPosts);
router.post(
  '/',
  authenticate,
  [
    body('title').notEmpty().withMessage('Le titre est requis'),
    body('content').notEmpty().withMessage('Le contenu est requis'),
    body('category').notEmpty().withMessage('La catégorie est requise')
  ],
  validateRequest,
  forumController.createPost
);

router.get('/:id', authenticate, forumController.getPostById);
router.put('/:id', authenticate, forumController.updatePost);
router.delete('/:id', authenticate, forumController.deletePost);
router.post('/:id/like', authenticate, forumController.likePost);
router.post('/:id/comment', authenticate, forumController.addComment);
router.post('/:id/report', authenticate, forumController.reportPost);

export { router as forumRouter };
export default router; 