import { Document, Model, Types } from 'mongoose';
import { PaginationOptions, PaginatedResult, FilterQuery, UpdateQuery } from './models';

export interface BaseServiceOptions {
  model: Model<any>;
  populate?: string[];
}

export interface CRUDService<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(conditions: Partial<T>): Promise<T | null>;
  find(conditions: Partial<T>): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface CacheOptions {
  ttl?: number;
  key?: string;
}

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface EmailService {
  sendWelcomeEmail(to: string, name: string): Promise<void>;
  sendPasswordReset(to: string, token: string): Promise<void>;
  sendVerification(to: string, token: string): Promise<void>;
}

export interface StorageService {
  upload(file: any, path: string): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  getSignedUrl(path: string, expiresIn?: number): Promise<string>;
}

export interface PaymentService {
  createPayment(amount: number, currency: string, description: string): Promise<any>;
  confirmPayment(paymentId: string): Promise<any>;
  refundPayment(paymentId: string, amount?: number): Promise<any>;
  getPayment(paymentId: string): Promise<any>;
}

export interface NotificationService {
  send(userId: string, notification: any): Promise<void>;
  markAsRead(notificationId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
  getUserNotifications(userId: string, options?: PaginationOptions): Promise<PaginatedResult<any>>;
}

export interface FileService {
  upload(file: any): Promise<string>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}

export interface AuthService {
  login(email: string, password: string): Promise<{ token: string; user: any }>;
  register(userData: any): Promise<{ token: string; user: any }>;
  verifyToken(token: string): Promise<any>;
  refreshToken(token: string): Promise<string>;
} 