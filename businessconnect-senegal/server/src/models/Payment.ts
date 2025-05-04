import mongoose, { Schema } from 'mongoose';
import { IPayment, PaymentStatus, PaymentCurrency, PaymentMethod } from '../types/payment';

const paymentSchema = new Schema<IPayment>({
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  currency: { 
    type: String, 
    required: true,
    enum: ['XOF', 'EUR', 'USD'] as PaymentCurrency[],
    default: 'XOF'
  },
  status: { 
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'] as PaymentStatus[],
    default: 'pending'
  },
  paymentMethod: { 
    type: String,
    enum: ['card', 'mobile_money', 'bank_transfer', 'cash'] as PaymentMethod[],
    required: true
  },
  paymentId: { 
    type: String,
    required: true,
    unique: true
  },
  transactionId: { 
    type: String,
    sparse: true
  },
  user: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: { 
    type: String,
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  errorMessage: String,
  refundReason: String
}, {
  timestamps: true
});

// Index pour la recherche
paymentSchema.index({ 
  paymentId: 1,
  transactionId: 1,
  user: 1,
  status: 1
});

// Middleware pre-save pour la validation
paymentSchema.pre('save', function(next) {
  if (this.status === 'refunded' && !this.refundReason) {
    next(new Error('La raison du remboursement est requise'));
  }
  next();
});

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema); 