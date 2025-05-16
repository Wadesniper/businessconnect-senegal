import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// Routes protégées par authentification
router.use(authenticate);

// Routes de configuration
router.post('/setup-intent', paymentController.createSetupIntent);
router.get('/payment-methods', paymentController.getPaymentMethods);
router.delete('/payment-methods/:id', paymentController.deletePaymentMethod);

// Routes de paiement
router.post('/pay', paymentController.processPayment);
router.post('/subscription', paymentController.createSubscription);
router.put('/subscription/cancel', paymentController.cancelSubscription);

// Routes de remboursement (admin uniquement)
router.post('/refund/:paymentId', isAdmin, paymentController.refundPayment);

// Webhooks
router.post('/webhook', paymentController.handleWebhook);

// Routes de factures
router.get('/invoices', paymentController.getInvoices);
router.get('/invoices/:id', paymentController.getInvoice);
router.get('/invoices/:id/download', paymentController.downloadInvoice);

// Routes protégées par authentification admin
router.use(isAdmin);

export default router; 