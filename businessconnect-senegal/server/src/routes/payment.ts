import { Router } from 'express';
// import { paymentController } from '../controllers/paymentController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// Routes protégées par authentification
router.use(authenticate);

// Routes de configuration
router.post('/setup-intent', (req: any, res: any) => {
  // paymentController.createSetupIntent(req, res);
});
router.get('/payment-methods', (req: any, res: any) => {
  // paymentController.getPaymentMethods(req, res);
});
router.delete('/payment-methods/:id', (req: any, res: any) => {
  // paymentController.deletePaymentMethod(req, res);
});

// Routes de paiement
router.post('/pay', (req: any, res: any) => {
  // paymentController.processPayment(req, res);
});
router.post('/subscription', (req: any, res: any) => {
  // paymentController.createSubscription(req, res);
});
router.put('/subscription/cancel', (req: any, res: any) => {
  // paymentController.cancelSubscription(req, res);
});

// Routes de remboursement (admin uniquement)
router.post('/refund/:paymentId', isAdmin, (req: any, res: any) => {
  // paymentController.refundPayment(req, res);
});

// Webhooks
router.post('/webhook', (req: any, res: any) => {
  // paymentController.handleWebhook(req, res);
});

// Routes de factures
router.get('/invoices', (req: any, res: any) => {
  // paymentController.getInvoices(req, res);
});
router.get('/invoices/:id', (req: any, res: any) => {
  // paymentController.getInvoice(req, res);
});
router.get('/invoices/:id/download', (req: any, res: any) => {
  // paymentController.downloadInvoice(req, res);
});

// Routes protégées par authentification admin
router.use(isAdmin);

export default router; 