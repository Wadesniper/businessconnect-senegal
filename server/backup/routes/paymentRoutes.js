"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { paymentController } from '../controllers/paymentController';
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Routes protégées (nécessitent une authentification)
router.use(auth_1.authenticate);
// Configuration du paiement
// router.post('/setup-intent', (req: AuthRequest, res: Response) => paymentController.createSetupIntent(req, res));
// router.get('/payment-methods', (req: any, res: any) => paymentController.getPaymentMethods(req, res));
// router.delete('/payment-methods/:id', (req: any, res: any) => paymentController.deletePaymentMethod(req, res));
// Paiements
// router.post('/process', (req: AuthRequest, res: Response) => paymentController.processPayment(req, res));
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
exports.default = router;
