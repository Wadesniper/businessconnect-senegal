import { Schema, model, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: Schema.Types.ObjectId;
  planId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  cancelledAt?: Date;
  renewedAt?: Date;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'cancelled'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  cancelledAt: {
    type: Date
  },
  renewedAt: {
    type: Date
  },
  paymentId: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes pour améliorer les performances
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ paymentId: 1 });

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema); 