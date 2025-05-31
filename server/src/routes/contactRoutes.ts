import express from 'express';
import { sendContactEmail } from '../controllers/contactController';
import { Request, Response } from 'express';

const router = express.Router();

// Route pour envoyer un email de contact
router.post('/', async (req: Request, res: Response): Promise<void> => {
  await sendContactEmail(req, res);
});

export default router; 