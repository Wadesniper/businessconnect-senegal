import { Router, Request, Response, NextFunction, AuthRequest, RouteHandler, AuthRouteHandler } from '../types/express';
// import { paymentController } from '../controllers/paymentController';
import { authenticate, isAdmin } from '../middleware/auth';
import { WebhookController } from '../controllers/webhookController';

const router = Router();
const webhookController = new WebhookController();

// Middleware pour gérer l'authentification (sauf webhook)
const authMiddleware: RouteHandler = (req, res, next) => {
  if (req.path === '/webhook') {
    return next();
  }
  return authenticate(req, res, next);
};

router.use(authMiddleware);

// Routes de configuration
const setupIntent: AuthRouteHandler = async (req, res) => {
  try {
    // TODO: Implémenter la création d'intention de paiement
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'intention de paiement' });
  }
};

const getPaymentMethods: AuthRouteHandler = async (req, res) => {
  try {
    // TODO: Implémenter la récupération des méthodes de paiement
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des méthodes de paiement' });
  }
};

const deletePaymentMethod: AuthRouteHandler = async (req, res) => {
  try {
    // TODO: Implémenter la suppression de méthode de paiement
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la méthode de paiement' });
  }
};

// Routes de paiement
const processPayment: AuthRouteHandler = async (req, res) => {
  try {
    // TODO: Implémenter le processus de paiement
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du traitement du paiement' });
  }
};

const createSubscription: AuthRouteHandler = async (req, res) => {
  try {
    // TODO: Implémenter la création d'abonnement
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'abonnement' });
  }
};

const cancelSubscription: AuthRouteHandler = async (req, res) => {
  try {
    // TODO: Implémenter l'annulation d'abonnement
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'annulation de l\'abonnement' });
  }
};

// Routes de remboursement (admin uniquement)
const refundPayment: AuthRouteHandler = async (req, res) => {
  try {
    // TODO: Implémenter le remboursement
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du remboursement' });
  }
};

// Routes de factures
const getInvoices: AuthRouteHandler = async (req, res) => {
  try {
    // TODO: Implémenter la récupération des factures
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures' });
  }
};

const getInvoice: AuthRouteHandler = async (req, res) => {
  try {
    // TODO: Implémenter la récupération d'une facture
    res.json({});
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la facture' });
  }
};

const downloadInvoice: AuthRouteHandler = async (req, res) => {
  try {
    // TODO: Implémenter le téléchargement de facture
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du téléchargement de la facture' });
  }
};

// Configuration des routes
router.post('/setup-intent', setupIntent);
router.get('/payment-methods', getPaymentMethods);
router.delete('/payment-methods/:id', deletePaymentMethod);

router.post('/pay', processPayment);
router.post('/subscription', createSubscription);
router.put('/subscription/cancel', cancelSubscription);

router.post('/refund/:paymentId', isAdmin, refundPayment);

router.post('/webhook', webhookController.handleCinetPayWebhook);

router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoice);
router.get('/invoices/:id/download', downloadInvoice);

export default router; 