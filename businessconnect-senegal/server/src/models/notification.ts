import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType, INotification } from '../types/notification';

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'subscription_created',
      'subscription_cancelled',
      'subscription_renewed',
      'subscription_expiration',
      'payment_success',
      'payment_failure',
      'new_post',
      'topic_report',
      'post_report',
      'new_job_application',
      'order_notification'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour la recherche
notificationSchema.index({ 
  userId: 1,
  isRead: 1,
  createdAt: -1
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema); 