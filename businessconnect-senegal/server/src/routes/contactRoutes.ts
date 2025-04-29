import express from 'express';
import { sendContactEmail } from '../controllers/contactController';

const router = express.Router();

// Route pour envoyer un email de contact
router.post('/', sendContactEmail);

export default router; 