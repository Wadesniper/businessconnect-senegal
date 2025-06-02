import { Router, Request, Response, NextFunction } from 'express';
// import { paymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
// import { checkInvoiceAccess } from '../middleware/invoiceAccess';
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
router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await paymentController.createPayment(req as AuthRequest, res);
  } catch (error) {
    next(error);
  }
});

router.post('/confirm', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await paymentController.confirmPayment(req as AuthRequest, res);
  } catch (error) {
    next(error);
  }
});

router.get('/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await paymentController.getPaymentHistory(req as AuthRequest, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:paymentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await paymentController.getPaymentDetails(req as AuthRequest, res);
  } catch (error) {
    next(error);
  }
});

// Routes
// router.post('/create', createPayment);
// router.post('/confirm', confirmPayment);
// router.get('/history', getPaymentHistory);
// router.get('/:paymentId', getPaymentDetails);

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