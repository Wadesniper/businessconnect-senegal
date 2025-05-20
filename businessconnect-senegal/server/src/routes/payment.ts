import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// Routes protégées par authentification
router.use(authenticate);

// Routes de configuration
router.post('/setup-intent', paymentController.createSetupIntent);
router.get('/payment-methods', (req: any, res: any) => paymentController.getPaymentMethods(req, res));
router.delete('/payment-methods/:id', (req: any, res: any) => paymentController.deletePaymentMethod(req, res));

// Routes de paiement
router.post('/pay', paymentController.processPayment);
router.post('/subscription', paymentController.createSubscription);
router.put('/subscription/cancel', paymentController.cancelSubscription);

// Routes de remboursement (admin uniquement)
router.post('/refund/:paymentId', isAdmin, (req: any, res: any) => paymentController.refundPayment(req, res));

// Webhooks
router.post('/webhook', paymentController.handleWebhook);

// Routes de factures
router.get('/invoices', (req: any, res: any) => paymentController.getInvoices(req, res));
router.get('/invoices/:id', (req: any, res: any) => paymentController.getInvoice(req, res));
router.get('/invoices/:id/download', paymentController.downloadInvoice);

// Routes protégées par authentification admin
router.use(isAdmin);

export default router; 