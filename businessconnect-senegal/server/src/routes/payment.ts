import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate, isAdmin } from '../middleware/auth';
import { paytechMiddleware } from '../middleware/paytechMiddleware';

const router = Router();

// Routes protégées par authentification
router.use(authenticate);

// Routes de configuration
router.post('/setup-intent', paymentController.createSetupIntent);
router.get('/payment-methods', paymentController.getPaymentMethods);
router.delete('/payment-methods/:id', paymentController.deletePaymentMethod);

// Routes de paiement
router.post('/pay', paytechMiddleware, paymentController.processPayment);
router.post('/subscription', paytechMiddleware, paymentController.createSubscription);
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

// Obtenir l'historique des paiements (admin seulement)
router.get('/history', async (req, res) => {
  await paymentController.getPaymentHistory(req, res);
});

// Obtenir les statistiques de paiement (admin seulement)
router.get('/stats', async (req, res) => {
  await paymentController.getPaymentStats(req, res);
});

export default router; 