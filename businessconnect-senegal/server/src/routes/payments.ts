import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { body } from 'express-validator';

const router = Router();

interface CreatePaymentRequest extends Request {
  body: {
    amount: number;
    currency: string;
    description: string;
  }
}

// Routes de paiement à implémenter
router.post(
  '/create-payment',
  authenticate,
  [
    body('amount').isNumeric().withMessage('Le montant doit être un nombre'),
    body('currency').isString().withMessage('La devise est requise'),
    body('description').isString().withMessage('La description est requise')
  ],
  validateRequest,
  (req: CreatePaymentRequest, res: Response) => {
    res.json({ message: 'Payment routes will be implemented here' });
  }
);

export default router; 