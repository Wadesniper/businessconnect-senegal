import { logger } from '../utils/logger';
import { Payment } from '../models/Payment';
import { Schema } from 'mongoose';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  IPayment,
  PaymentCreateData,
  PaymentGatewayConfig,
  PaymentGatewayResponse,
  PaymentInitiationResponse,
  PaymentConfirmationData,
  PaymentRefundData,
  PaymentStats
} from '../types/payment';

export class PaymentService {
  private readonly config: PaymentGatewayConfig;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
  }

  async initiatePayment(data: PaymentCreateData): Promise<PaymentInitiationResponse> {
    try {
      // Créer un enregistrement de paiement initial
      const payment = new Payment({
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        user: new Schema.Types.ObjectId(data.userId),
        paymentMethod: data.paymentMethod,
        paymentId: uuidv4(),
        metadata: data.metadata
      });

      // Appeler la passerelle de paiement
      const gatewayResponse = await this.callPaymentGateway({
        amount: data.amount,
        currency: data.currency,
        paymentId: payment.paymentId,
        description: data.description,
        metadata: data.metadata
      });

      if (!gatewayResponse.success) {
        payment.status = 'failed';
        payment.errorMessage = gatewayResponse.error;
      } else {
        payment.status = 'pending';
        payment.transactionId = gatewayResponse.transactionId;
      }

      await payment.save();

      return {
        success: true,
        data: {
          paymentId: payment.paymentId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          redirectUrl: gatewayResponse.redirectUrl
        }
      };
    } catch (error) {
      logger.error('Erreur lors de l\'initiation du paiement:', error);
      throw error;
    }
  }

  private async callPaymentGateway(data: {
    amount: number;
    currency: string;
    paymentId: string;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<PaymentGatewayResponse> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/payments`,
        {
          ...data,
          apiKey: this.config.apiKey
        }
      );

      return {
        success: true,
        paymentId: data.paymentId,
        transactionId: response.data.transactionId,
        redirectUrl: response.data.redirectUrl
      };
    } catch (error) {
      logger.error('Erreur lors de l\'appel à la passerelle de paiement:', error);
      return {
        success: false,
        paymentId: data.paymentId,
        error: 'Erreur lors du traitement du paiement'
      };
    }
  }

  async confirmPayment(data: PaymentConfirmationData): Promise<IPayment> {
    try {
      const payment = await Payment.findOne({ paymentId: data.paymentId });
      if (!payment) {
        throw new Error('Paiement non trouvé');
      }

      // Vérifier le statut du paiement avec la passerelle
      const isValid = await this.verifyPaymentWithGateway(data);
      
      if (isValid) {
        payment.status = data.status;
        payment.transactionId = data.transactionId;
        if (data.metadata) {
          payment.metadata = { ...payment.metadata, ...data.metadata };
        }
      } else {
        payment.status = 'failed';
        payment.errorMessage = 'La vérification du paiement a échoué';
      }

      await payment.save();
      return payment.toObject();
    } catch (error) {
      logger.error('Erreur lors de la confirmation du paiement:', error);
      throw error;
    }
  }

  private async verifyPaymentWithGateway(data: PaymentConfirmationData): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/verify`,
        {
          ...data,
          apiKey: this.config.apiKey
        }
      );

      return response.data.success;
    } catch (error) {
      logger.error('Erreur lors de la vérification du paiement:', error);
      return false;
    }
  }

  async refundPayment(data: PaymentRefundData): Promise<IPayment> {
    try {
      const payment = await Payment.findOne({ paymentId: data.paymentId });
      if (!payment) {
        throw new Error('Paiement non trouvé');
      }

      if (payment.status !== 'completed') {
        throw new Error('Le paiement ne peut pas être remboursé');
      }

      // Appeler la passerelle de paiement pour le remboursement
      const refundSuccess = await this.processRefundWithGateway({
        paymentId: payment.paymentId,
        transactionId: payment.transactionId!,
        amount: data.amount || payment.amount,
        reason: data.reason,
        metadata: data.metadata
      });
      
      if (refundSuccess) {
        payment.status = 'refunded';
        payment.refundReason = data.reason;
        if (data.metadata) {
          payment.metadata = { ...payment.metadata, ...data.metadata };
        }
        await payment.save();
      } else {
        throw new Error('Le remboursement a échoué');
      }

      return payment.toObject();
    } catch (error) {
      logger.error('Erreur lors du remboursement:', error);
      throw error;
    }
  }

  private async processRefundWithGateway(data: {
    paymentId: string;
    transactionId: string;
    amount: number;
    reason: string;
    metadata?: Record<string, any>;
  }): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/refund`,
        {
          ...data,
          apiKey: this.config.apiKey
        }
      );

      return response.data.success;
    } catch (error) {
      logger.error('Erreur lors du traitement du remboursement:', error);
      return false;
    }
  }

  async getPaymentById(paymentId: string): Promise<IPayment | null> {
    try {
      const payment = await Payment.findOne({ paymentId });
      return payment ? payment.toObject() : null;
    } catch (error) {
      logger.error('Erreur lors de la récupération du paiement:', error);
      throw error;
    }
  }

  async getPaymentsByUser(userId: string): Promise<IPayment[]> {
    try {
      const payments = await Payment.find({ user: new Schema.Types.ObjectId(userId) })
        .sort({ createdAt: -1 });
      return payments.map(payment => payment.toObject());
    } catch (error) {
      logger.error('Erreur lors de la récupération des paiements:', error);
      throw error;
    }
  }

  async getPaymentsByStatus(status: IPayment['status']): Promise<IPayment[]> {
    try {
      const payments = await Payment.find({ status })
        .sort({ createdAt: -1 });
      return payments.map(payment => payment.toObject());
    } catch (error) {
      logger.error('Erreur lors de la récupération des paiements par statut:', error);
      throw error;
    }
  }

  async getPaymentStats(startDate: Date, endDate: Date): Promise<PaymentStats> {
    try {
      const [totalStats, successStats, failedStats, refundedStats] = await Promise.all([
        Payment.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: '$currency',
              totalAmount: { $sum: '$amount' },
              totalCount: { $sum: 1 }
            }
          }
        ]),
        Payment.aggregate([
          {
            $match: {
              status: 'completed',
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: '$currency',
              successfulAmount: { $sum: '$amount' },
              successfulCount: { $sum: 1 }
            }
          }
        ]),
        Payment.aggregate([
          {
            $match: {
              status: 'failed',
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: '$currency',
              failedAmount: { $sum: '$amount' },
              failedCount: { $sum: 1 }
            }
          }
        ]),
        Payment.aggregate([
          {
            $match: {
              status: 'refunded',
              createdAt: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: '$currency',
              refundedAmount: { $sum: '$amount' },
              refundedCount: { $sum: 1 }
            }
          }
        ])
      ]);

      return {
        totalAmount: totalStats[0]?.totalAmount || 0,
        totalCount: totalStats[0]?.totalCount || 0,
        successfulAmount: successStats[0]?.successfulAmount || 0,
        successfulCount: successStats[0]?.successfulCount || 0,
        failedAmount: failedStats[0]?.failedAmount || 0,
        failedCount: failedStats[0]?.failedCount || 0,
        refundedAmount: refundedStats[0]?.refundedAmount || 0,
        refundedCount: refundedStats[0]?.refundedCount || 0,
        currency: totalStats[0]?._id || 'XOF',
        periodStart: startDate,
        periodEnd: endDate
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques de paiement:', error);
      throw error;
    }
  }
} 