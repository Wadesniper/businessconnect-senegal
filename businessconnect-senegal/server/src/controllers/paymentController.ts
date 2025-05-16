import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { query } from '../config/database';
import { emailService } from '../services/emailService';
import { pdfService } from '../services/pdfService';
import { AppError } from '../utils/errors';
import { config } from '../config';
import { AuthRequest } from '../types/user';

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  metadata: Record<string, any>;
  created_at: Date;
}

export const paymentController = {
  async createSetupIntent(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      if (!user) {
        throw new AppError('Utilisateur non authentifié', 401);
      }
      
      // TODO: Implémentation de la création d'un intent de configuration
      res.json({ setupIntent: 'TODO' });
    } catch (error) {
      logger.error('Error creating setup intent:', error);
      throw new AppError('Erreur lors de la configuration du paiement', 500);
    }
  },

  async getPaymentMethods(req: Request, res: Response) {
    try {
      const { user } = req;
      // TODO: Implémenter la récupération des méthodes de paiement
      res.json({ payment_methods: [] });
    } catch (error) {
      logger.error('Error fetching payment methods:', error);
      throw new AppError('Erreur lors de la récupération des méthodes de paiement', 500);
    }
  },

  async deletePaymentMethod(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // TODO: Implémenter la suppression de la méthode de paiement
      res.json({ success: true });
    } catch (error) {
      logger.error('Error deleting payment method:', error);
      throw new AppError('Erreur lors de la suppression de la méthode de paiement', 500);
    }
  },

  async processPayment(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      if (!user) {
        throw new AppError('Utilisateur non authentifié', 401);
      }

      // TODO: Utiliser req.body pour la logique CinetPay
      res.json({ paymentIntent: 'TODO' });
    } catch (error) {
      logger.error('Error processing payment:', error);
      throw new AppError('Erreur lors du traitement du paiement', 500);
    }
  },

  async createSubscription(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      if (!user) {
        throw new AppError('Utilisateur non authentifié', 401);
      }

      // TODO: Utiliser req.body pour la logique CinetPay
      res.json({ subscription: 'TODO' });
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw new AppError('Erreur lors de la création de l\'abonnement', 500);
    }
  },

  async cancelSubscription(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      if (!user) {
        throw new AppError('Utilisateur non authentifié', 401);
      }

      // TODO: Utiliser req.body pour la logique CinetPay
      res.json({ success: true });
    } catch (error) {
      logger.error('Error canceling subscription:', error);
      throw new AppError('Erreur lors de l\'annulation de l\'abonnement', 500);
    }
  },

  async refundPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      // TODO: Utiliser req.body pour la logique CinetPay
      res.json({ refund: 'TODO' });
    } catch (error) {
      logger.error('Error processing refund:', error);
      throw new AppError('Erreur lors du remboursement', 500);
    }
  },

  async getInvoices(req: Request, res: Response) {
    try {
      const { user } = req;
      // TODO: Implémenter la récupération des factures
      res.json({ invoices: [] });
    } catch (error) {
      logger.error('Error fetching invoices:', error);
      throw new AppError('Erreur lors de la récupération des factures', 500);
    }
  },

  async getInvoice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // TODO: Implémenter la récupération d'une facture spécifique
      res.json({ invoice: null });
    } catch (error) {
      logger.error('Error fetching invoice:', error);
      throw new AppError('Erreur lors de la récupération de la facture', 500);
    }
  },

  async downloadInvoice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // Vérifier que l'utilisateur a accès à cette facture
      const invoice = await query(`
        SELECT * FROM invoices WHERE id = $1 AND user_id = $2
      `, [id, userId]);

      if (invoice.rows.length === 0) {
        throw new AppError('Facture non trouvée', 404);
      }

      const filePath = await pdfService.getInvoicePath(invoice.rows[0].invoice_id);
      if (!filePath) {
        throw new AppError('Fichier de facture non trouvé', 404);
      }

      res.download(filePath);
    } catch (error) {
      logger.error('Erreur lors du téléchargement de la facture:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Erreur lors du téléchargement de la facture'
        });
      }
    }
  },

  async handleWebhook(req: Request, res: Response) {
    try {
      const sig = req.headers['paytech-signature'];
      const event = paytech.constructEvent(req.body, sig as string);

      // Gérer différents types d'événements
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentSuccess(event.data);
          break;
        case 'payment_intent.failed':
          await handlePaymentFailure(event.data);
          break;
        case 'subscription.created':
          await handleSubscriptionCreated(event.data);
          break;
        case 'subscription.updated':
          await handleSubscriptionUpdated(event.data);
          break;
        case 'subscription.deleted':
          await handleSubscriptionDeleted(event.data);
          break;
        case 'invoice.paid':
          await handleInvoicePaid(event.data);
          break;
        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data);
          break;
        default:
          logger.info(`Type d'événement non géré: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      logger.error('Erreur lors du traitement du webhook:', error);
      res.status(400).json({ 
        error: 'Erreur webhook',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }
};

// Fonctions de gestion des webhooks
async function handlePaymentSuccess(data: any) {
  const { payment_intent_id, order_id } = data;
  
  // Mettre à jour la transaction
  const transaction = await query(`
    UPDATE transactions
    SET status = 'completed', 
        completed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE payment_intent_id = $1
    RETURNING id, user_id, amount, currency
  `, [payment_intent_id]);

  if (order_id) {
    await query(`
      UPDATE orders
      SET payment_status = 'paid',
          status = 'processing',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [order_id]);
  }

  // Récupérer l'email de l'utilisateur
  const user = await query('SELECT email FROM users WHERE id = $1', [transaction.rows[0].user_id]);
  
  // Envoyer l'email de confirmation
  await emailService.sendPaymentSuccessEmail(user.rows[0].email, {
    amount: transaction.rows[0].amount,
    currency: transaction.rows[0].currency,
    payment_intent_id
  });
}

async function handlePaymentFailure(data: any) {
  const { payment_intent_id, order_id, error } = data;
  
  // Mettre à jour la transaction
  const transaction = await query(`
    UPDATE transactions
    SET status = 'failed',
        error_message = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE payment_intent_id = $2
    RETURNING id, user_id, amount, currency
  `, [error.message, payment_intent_id]);

  if (order_id) {
    await query(`
      UPDATE orders
      SET payment_status = 'failed',
          status = 'payment_failed',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [order_id]);
  }

  // Récupérer l'email de l'utilisateur
  const user = await query('SELECT email FROM users WHERE id = $1', [transaction.rows[0].user_id]);
  
  // Envoyer l'email d'échec
  await emailService.sendPaymentFailureEmail(user.rows[0].email, {
    amount: transaction.rows[0].amount,
    currency: transaction.rows[0].currency,
    error
  });
}

async function handleSubscriptionCreated(data: any) {
  const { subscription_id, customer_id, status, plan_id, current_period_end } = data;
  
  // Insérer l'abonnement
  await query(`
    INSERT INTO subscriptions (
      subscription_id, user_id, plan_id, status,
      current_period_end, created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `, [subscription_id, customer_id, plan_id, status, current_period_end]);

  // Mettre à jour le statut de l'utilisateur
  await query(`
    UPDATE users
    SET subscription_status = $1,
        subscription_id = $2,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
  `, [status, subscription_id, customer_id]);

  // Récupérer les informations du plan et de l'utilisateur
  const [plan, user] = await Promise.all([
    query('SELECT name FROM subscription_plans WHERE id = $1', [plan_id]),
    query('SELECT email FROM users WHERE id = $1', [customer_id])
  ]);

  // Envoyer l'email de confirmation
  await emailService.sendSubscriptionCreatedEmail(user.rows[0].email, {
    plan_name: plan.rows[0].name,
    current_period_start: new Date(),
    current_period_end: new Date(current_period_end)
  });
}

async function handleSubscriptionUpdated(data: any) {
  const { subscription_id, status, current_period_end, cancel_at_period_end } = data;
  
  // Mettre à jour l'abonnement
  const subscription = await query(`
    UPDATE subscriptions
    SET status = $1,
        current_period_end = $2,
        cancel_at_period_end = $3,
        updated_at = CURRENT_TIMESTAMP
    WHERE subscription_id = $4
    RETURNING user_id
  `, [status, current_period_end, cancel_at_period_end, subscription_id]);

  // Mettre à jour le statut de l'utilisateur
  await query(`
    UPDATE users
    SET subscription_status = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE subscription_id = $2
  `, [status, subscription_id]);

  if (cancel_at_period_end) {
    // Récupérer l'email de l'utilisateur
    const user = await query('SELECT email FROM users WHERE id = $1', [subscription.rows[0].user_id]);
    
    // Envoyer l'email d'annulation programmée
    await emailService.sendSubscriptionCancelledEmail(user.rows[0].email, {
      current_period_end
    });
  }
}

async function handleSubscriptionDeleted(data: any) {
  const { subscription_id } = data;
  
  // Récupérer les informations de l'abonnement avant de le mettre à jour
  const subscription = await query(`
    SELECT user_id, current_period_end
    FROM subscriptions
    WHERE subscription_id = $1
  `, [subscription_id]);

  // Mettre à jour l'abonnement
  await query(`
    UPDATE subscriptions
    SET status = 'cancelled',
        cancelled_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE subscription_id = $1
  `, [subscription_id]);

  // Mettre à jour le statut de l'utilisateur
  await query(`
    UPDATE users
    SET subscription_status = 'cancelled',
        subscription_id = NULL,
        updated_at = CURRENT_TIMESTAMP
    WHERE subscription_id = $1
  `, [subscription_id]);

  // Récupérer l'email de l'utilisateur
  const user = await query('SELECT email FROM users WHERE id = $1', [subscription.rows[0].user_id]);
  
  // Envoyer l'email de confirmation d'annulation
  await emailService.sendSubscriptionCancelledEmail(user.rows[0].email, {
    current_period_end: subscription.rows[0].current_period_end
  });
}

async function handleInvoicePaid(data: any) {
  const { invoice_id, subscription_id, amount_paid, customer_id } = data;
  
  // Récupérer les informations de l'abonnement et de l'utilisateur
  const [subscription, user] = await Promise.all([
    query('SELECT current_period_start, current_period_end FROM subscriptions WHERE subscription_id = $1', [subscription_id]),
    query('SELECT email, name FROM users WHERE id = $1', [customer_id])
  ]);

  // Générer la facture PDF
  const filePath = await pdfService.generateAndSaveInvoice({
    invoice_id,
    customer_name: user.rows[0].name,
    customer_email: user.rows[0].email,
    amount: amount_paid,
    currency: 'XOF',
    date: new Date(),
    items: [{
      description: 'Abonnement BusinessConnect',
      quantity: 1,
      unit_price: amount_paid,
      total: amount_paid
    }],
    subtotal: amount_paid,
    tax: 0,
    total: amount_paid
  });

  // Enregistrer la facture dans la base de données
  await query(`
    INSERT INTO invoices (
      invoice_id, subscription_id, user_id,
      amount, status, pdf_url, paid_at, created_at
    )
    VALUES ($1, $2, $3, $4, 'paid', $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `, [invoice_id, subscription_id, customer_id, amount_paid, filePath]);
}

async function handleInvoicePaymentFailed(data: any) {
  const { invoice_id, subscription_id, customer_id, error } = data;
  
  await query(`
    INSERT INTO invoices (
      invoice_id, subscription_id, user_id,
      status, error_message, created_at
    )
    VALUES ($1, $2, $3, 'failed', $4, CURRENT_TIMESTAMP)
  `, [invoice_id, subscription_id, customer_id, error.message]);

  // Récupérer l'email de l'utilisateur
  const user = await query('SELECT email FROM users WHERE id = $1', [customer_id]);
  
  // Envoyer l'email d'échec de paiement de facture
  await emailService.sendPaymentFailureEmail(user.rows[0].email, {
    error
  });
} 