import { Router } from 'express';
// Utiliser nos types personnalisés qui s'appuient sur les types Express
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express';
import { authenticate, isAdmin } from '../middleware/auth';
import { WebhookController } from '../controllers/webhookController';
import { paymentController } from '../controllers/paymentController';

const router = Router();
const webhookController = new WebhookController();

// Ce middleware est appliqué à toutes les routes de ce routeur.
// Il exécute 'authenticate' sauf pour le webhook.
const authMiddlewareApplicator = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/webhook' || req.path === '/webhook/cinetpay') { // Exclure aussi /webhook/cinetpay
    return next();
  }
  return authenticate(req, res, next); // Applique authenticate qui ajoute req.user
};
router.use(authMiddlewareApplicator);

// Pour les routes après authMiddlewareApplicator (sauf /webhook), req devrait être une AuthRequest.
// Les handlers utilisent req: Request, et font un cast vers AuthRequest si besoin.

// Routes de configuration
const setupIntent = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
  try {
    // TODO: Implémenter la création d'intention de paiement (utiliser authReq.user si besoin)
    res.json({ success: true, userId: authReq.user.id });
  } catch (error) {
    next(error); // Gestion centralisée des erreurs
  }
};

const getPaymentMethods = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
  try {
    // TODO: Implémenter la récupération des méthodes de paiement (utiliser authReq.user si besoin)
    res.json([]);
  } catch (error) {
    next(error);
  }
};

const deletePaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
  try {
    res.json({ success: true, id: authReq.params.id }); 
  } catch (error) {
    next(error);
  }
};

// Routes de paiement
const processPayment = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
  try {
    res.json({ success: true, body: authReq.body }); 
  } catch (error) {
    next(error);
  }
};

const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
  try {
    res.json({ success: true, body: authReq.body }); 
  } catch (error) {
    next(error);
  }
};

const cancelSubscription = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
  try {
    // Utiliser authReq.user si besoin pour identifier l'abonnement à annuler
    res.json({ success: true, userId: authReq.user.id });
  } catch (error) {
    next(error);
  }
};

// Routes de remboursement (admin uniquement)
const refundPayment = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
  try {
    // isAdmin a déjà vérifié req.user.role. Utiliser authReq.user si besoin pour logs/etc.
    res.json({ success: true, paymentId: authReq.params.paymentId }); 
  } catch (error) {
    next(error);
  }
};

// Routes de factures
const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
  try {
    // Utiliser authReq.user.id pour filtrer les factures
    res.json([]);
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
  try {
    // Utiliser authReq.user.id et authReq.params.id
    res.json({ id: authReq.params.id, userId: authReq.user.id }); 
  } catch (error) {
    next(error);
  }
};

const downloadInvoice = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) { return res.status(401).json({ error: 'Authentification requise' }); }
  try {
    // Utiliser authReq.user.id et authReq.params.id
    res.json({ success: true, id: authReq.params.id, userId: authReq.user.id }); 
  } catch (error) {
    next(error);
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