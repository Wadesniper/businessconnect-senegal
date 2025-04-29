import express from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { checkInvoiceAccess } from '../middleware/invoiceAccess';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = express.Router();

// Schémas de validation
const processPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  payment_method_id: z.string(),
  order_id: z.string()
});

const subscriptionSchema = z.object({
  plan_id: z.string(),
  payment_method_id: z.string()
});

const refundSchema = z.object({
  amount: z.number().positive(),
  reason: z.string().optional()
});

// Routes protégées (nécessitent une authentification)
router.use(authenticate);

// Configuration du paiement
router.post('/setup-intent', paymentController.createSetupIntent);
router.get('/payment-methods', paymentController.getPaymentMethods);
router.delete('/payment-methods/:id', paymentController.deletePaymentMethod);

// Paiements
router.post(
  '/process',
  validateRequest({ body: processPaymentSchema }),
  paymentController.processPayment
);

// Abonnements
router.post(
  '/subscriptions',
  validateRequest({ body: subscriptionSchema }),
  paymentController.createSubscription
);
router.delete('/subscriptions', paymentController.cancelSubscription);

// Remboursements
router.post(
  '/refunds/:paymentId',
  validateRequest({ body: refundSchema }),
  paymentController.refundPayment
);

// Factures
router.get('/invoices', paymentController.getInvoices);
router.get('/invoices/:id', checkInvoiceAccess, paymentController.getInvoice);
router.get('/invoices/:id/download', checkInvoiceAccess, paymentController.downloadInvoice);

// Webhook (non protégé)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

export default router; 