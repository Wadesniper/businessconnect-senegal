import { Document, Types } from 'mongoose';
import { WebSocket } from 'ws';
import { BaseDocument } from './global';

export type NotificationType = 
  | 'subscription_created'
  | 'subscription_cancelled'
  | 'subscription_renewed'
  | 'subscription_expiration'
  | 'subscription_expired'
  | 'payment_success'
  | 'payment_failure'
  | 'new_post'
  | 'post_like'
  | 'new_comment'
  | 'topic_report'
  | 'post_report'
  | 'new_job_application'
  | 'order_notification';

export interface NotificationMetadata {
  event?: string;
  daysLeft?: number;
  subscriptionType?: string;
  amount?: number;
  currency?: string;
  [key: string]: any;
}

export interface NotificationConfig {
  daysBeforeExpiration: number[];
  emailRetries: number;
  maxBulkSize: number;
}

export interface NotificationOptions {
  page?: number;
  limit?: number;
  isRead?: boolean;
  offset?: number;
  unreadOnly?: boolean;
  sortBy?: 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface NotificationCreateData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationMetadata;
  priority?: 'low' | 'normal' | 'high';
  metadata?: NotificationMetadata;
}

export interface NotificationResponse {
  notifications: NotificationDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unread?: number;
}

export interface WebSocketConnection {
  userId: string;
  socket: WebSocket;
  lastActivity: Date;
}

export interface BulkNotificationData {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationMetadata;
}

export interface INotification extends BaseDocument {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationMetadata;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
}

export type NotificationDocument = INotification & Document; 