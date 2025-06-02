import { Router, RequestHandler } from 'express';
import { contactController } from '../controllers/contactController';

const router = Router();

const sendMessage: RequestHandler = (req, res, next) => {
  contactController.sendMessage(req, res).catch(next);
};

router.post('/send', sendMessage);

export default router; 