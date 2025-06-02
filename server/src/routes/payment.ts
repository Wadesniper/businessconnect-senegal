import { Router } from 'express';
import { Request, Response, NextFunction, AuthRequest } from '../types/express';
// import { paymentController } from '../controllers/paymentController';
import { authenticate, isAdmin } from '../middleware/auth';
import { WebhookController } from '../controllers/webhookController';

const router = Router();
const webhookController = new WebhookController();

// Ce middleware est appliqué à toutes les routes de ce routeur.
// Il exécute 'authenticate' sauf pour le webhook.
const authMiddlewareApplicator = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/webhook') {
    return next(); // Pas d'authentification pour le webhook
  }
  // 'authenticate' devrait maintenant modifier req pour y ajouter .user
  // et le rendre conforme à AuthRequest pour les gestionnaires suivants.
  return authenticate(req, res, next);
};
router.use(authMiddlewareApplicator);

// Pour les routes après authMiddlewareApplicator (sauf /webhook), req devrait être une AuthRequest.

// Routes de configuration
const setupIntent = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implémenter la création d'intention de paiement
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'intention de paiement' });
  }
};

const getPaymentMethods = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implémenter la récupération des méthodes de paiement
    res.json([]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des méthodes de paiement' });
  }
};

const deletePaymentMethod = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implémenter la suppression de méthode de paiement
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la méthode de paiement' });
  }
};

// Routes de paiement
const processPayment = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implémenter le processus de paiement
    res.json({ success: true, body: req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du traitement du paiement' });
  }
};

const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implémenter la création d'abonnement
    res.json({ success: true, body: req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'abonnement' });
  }
};

const cancelSubscription = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implémenter l'annulation d'abonnement
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'annulation de l\'abonnement' });
  }
};

// Routes de remboursement (admin uniquement)
const refundPayment = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implémenter le remboursement
    res.json({ success: true, paymentId: req.params.paymentId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du remboursement' });
  }
};

// Routes de factures
const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implémenter la récupération des factures
    res.json([]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des factures' });
  }
};

const getInvoice = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implémenter la récupération d'une facture
    res.json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la facture' });
  }
};

const downloadInvoice = async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implémenter le téléchargement de facture
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error(error);
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

router.post('/webhook', webhookController.handleCinetPayWebhook as any);

router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoice);
router.get('/invoices/:id/download', downloadInvoice);

export default router; 