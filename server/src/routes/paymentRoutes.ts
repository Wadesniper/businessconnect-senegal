import { Router } from 'express';
// import { paymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
// import { checkInvoiceAccess } from '../middleware/invoiceAccess';
import { Response } from 'express';
import { AuthRequest } from '../types/express';
import { paymentController } from '../controllers/paymentController';

const router = Router();

// Middleware d'authentification pour toutes les routes de paiement
router.use(authenticate);

// Configuration du paiement
// router.post('/setup-intent', (req: AuthRequest, res: Response) => paymentController.createSetupIntent(req, res));
// router.get('/payment-methods', (req: any, res: any) => paymentController.getPaymentMethods(req, res));
// router.delete('/payment-methods/:id', (req: any, res: any) => paymentController.deletePaymentMethod(req, res));

// Handlers
const createPayment = async (req: AuthRequest, res: Response, next: Function) => {
  paymentController.createPayment(req, res).catch(next);
};

const confirmPayment = async (req: AuthRequest, res: Response, next: Function) => {
  paymentController.confirmPayment(req, res).catch(next);
};

const getPaymentHistory = async (req: AuthRequest, res: Response, next: Function) => {
  paymentController.getPaymentHistory(req, res).catch(next);
};

const getPaymentDetails = async (req: AuthRequest, res: Response, next: Function) => {
  paymentController.getPaymentDetails(req, res).catch(next);
};

// Routes
router.post('/create', createPayment);
router.post('/confirm', confirmPayment);
router.get('/history', getPaymentHistory);
router.get('/:paymentId', getPaymentDetails);

// Abonnements
// router.post('/subscriptions', (req: AuthRequest, res: Response) => paymentController.createSubscription(req, res));
// router.delete('/subscriptions', (req: AuthRequest, res: Response) => paymentController.cancelSubscription(req, res));

// Remboursements
// router.post('/refunds/:paymentId', (req: any, res: any) => paymentController.refundPayment(req, res));

// Factures
// router.get('/invoices', (req: any, res: any) => paymentController.getInvoices(req, res));
// router.get('/invoices/:id', checkInvoiceAccess, (req: any, res: any) => paymentController.getInvoice(req, res));
// router.get('/invoices/:id/download', checkInvoiceAccess, (req: AuthRequest, res: Response) => paymentController.downloadInvoice(req, res));

// Webhook (non protégé)
// router.post('/webhook', express.raw({ type: 'application/json' }), (req: AuthRequest, res: Response) => paymentController.handleWebhook(req, res));

export default router; 