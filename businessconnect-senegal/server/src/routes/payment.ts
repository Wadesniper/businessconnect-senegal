import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { paytechMiddleware } from '../middleware/paytechMiddleware';

const router = Router();

// Protection de toutes les routes de paiement
router.use(authMiddleware);

// Routes de configuration
router.post('/setup-intent', paymentController.createSetupIntent);
router.get('/payment-methods', paymentController.getPaymentMethods);
router.delete('/payment-methods/:id', paymentController.deletePaymentMethod);

// Routes de paiement
router.post('/pay', paytechMiddleware, paymentController.processPayment);
router.post('/subscription', paytechMiddleware, paymentController.createSubscription);
router.put('/subscription/cancel', paymentController.cancelSubscription);

// Routes de remboursement (admin uniquement)
router.post('/refund/:paymentId', authMiddleware.isAdmin, paymentController.refundPayment);

// Webhooks
router.post('/webhook', paymentController.handleWebhook);

// Routes de factures
router.get('/invoices', paymentController.getInvoices);
router.get('/invoices/:id', paymentController.getInvoice);
router.get('/invoices/:id/download', paymentController.downloadInvoice);

export default router; 