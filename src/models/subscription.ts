import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  type: 'basic' | 'premium';
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['basic', 'premium']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'pending', 'expired', 'cancelled'],
    default: 'pending'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  autoRenew: { type: Boolean, default: false },
  paymentId: { type: String }
}, {
  timestamps: true,
  toObject: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes pour améliorer les performances
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ paymentId: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema); 