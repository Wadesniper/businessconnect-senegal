import express from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { checkInvoiceAccess } from '../middleware/invoiceAccess';

const router = express.Router();

// Routes protégées (nécessitent une authentification)
router.use(authenticate);

// Configuration du paiement
router.post('/setup-intent', paymentController.createSetupIntent);
router.get('/payment-methods', paymentController.getPaymentMethods);
router.delete('/payment-methods/:id', paymentController.deletePaymentMethod);

// Paiements
router.post(
  '/process',
  // TODO: Ajouter une validation express-validator si besoin
  paymentController.processPayment
);

// Abonnements
router.post(
  '/subscriptions',
  // TODO: Ajouter une validation express-validator si besoin
  paymentController.createSubscription
);
router.delete('/subscriptions', paymentController.cancelSubscription);

// Remboursements
router.post(
  '/refunds/:paymentId',
  // TODO: Ajouter une validation express-validator si besoin
  paymentController.refundPayment
);

// Factures
router.get('/invoices', paymentController.getInvoices);
router.get('/invoices/:id', checkInvoiceAccess, paymentController.getInvoice);
router.get('/invoices/:id/download', checkInvoiceAccess, paymentController.downloadInvoice);

// Webhook (non protégé)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

export default router; 