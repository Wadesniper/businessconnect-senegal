import { Request } from 'express';
import { ObjectId } from 'mongoose';

declare module 'pdfkit' {
  class PDFDocument {
    constructor(options?: any);
    text(text: string, x?: number, y?: number, options?: any): this;
    font(font: string, size?: number): this;
    fontSize(size: number): this;
    moveDown(lines?: number): this;
    addPage(options?: any): this;
    image(src: string, x?: number, y?: number, options?: any): this;
    rect(x: number, y: number, w: number, h: number): this;
    fill(color: string): this;
    stroke(color: string): this;
    lineWidth(width: number): this;
    lineCap(style: string): this;
    lineJoin(style: string): this;
    circle(x: number, y: number, radius: number): this;
    polygon(points: Array<[number, number]>): this;
    end(): void;
  }
  export = PDFDocument;
}

declare module './inAppNotificationService' {
  export class InAppNotificationService {
    createNotification(userId: string, type: string, title: string, message: string, metadata?: any): Promise<void>;
  }
}

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
      permissions?: string[];
      subscription?: {
        plan: string;
        status: string;
        endDate: Date;
      };
      profile?: {
        firstName: string;
        lastName: string;
        avatar?: string;
      };
    };
    files?: {
      [fieldname: string]: Express.Multer.File[];
    };
    body: any;
    params: any;
    query: any;
  }

  interface Response {
    locals: {
      user?: any;
      [key: string]: any;
    };
  }
}

// Utility types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// MongoDB related types
type MongoDocument<T> = T & {
  _id: any;
  createdAt?: Date;
  updatedAt?: Date;
};

// Custom type declarations
interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

// Mongoose related types
interface MongooseDocument {
  _id: any;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

type MongooseModel<T> = T & MongooseDocument;

interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: { [key: string]: 1 | -1 };
  populate?: string | string[];
}

interface PaginatedResponse<T> {
  docs: T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Service types
interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | Error;
  message?: string;
  statusCode?: number;
}

// Error types
interface AppError extends Error {
  statusCode: number;
  status: string;
  isOperational?: boolean;
  path?: string;
  value?: any;
  code?: number;
}

// Auth types
interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

// Notification types
interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read?: boolean;
  createdAt?: Date;
}

// WebSocket types
interface WSMessage {
  type: string;
  payload: any;
}

// File upload types
interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

// Payment types
interface PaymentInfo {
  amount: number;
  currency: string;
  method: string;
  status: string;
  transactionId?: string;
  metadata?: Record<string, any>;
}

// Cache types
interface CacheOptions {
  ttl?: number;
  namespace?: string;
  key?: string;
}

// Logger types
interface LogEntry {
  level: string;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Config types
interface AppConfig {
  port: number;
  env: string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  aws?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  };
  redis?: {
    host: string;
    port: number;
    password?: string;
  };
}

// Event types
interface AppEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
  source?: string;
}

// Queue types
interface QueueJob<T = any> {
  id: string;
  type: string;
  data: T;
  priority?: number;
  attempts?: number;
  delay?: number;
}

// Metrics types
interface MetricData {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: Date;
}

// Health check types
interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  checks: {
    [key: string]: {
      status: 'up' | 'down';
      message?: string;
      latency?: number;
    };
  };
  timestamp: Date;
}

declare global {
  interface UserPayload {
    id: string;
    email: string;
    role: string;
  }

  interface AuthRequest extends Request {
    user: UserPayload;
  }

  interface WebSocketConnection {
    userId: string;
    socket: WebSocket;
    lastActivity: Date;
  }

  interface IUser {
    id: string;
    email: string;
    role: string;
  }

  interface PaymentWebhookData {
    event: string;
    paymentId: string;
    status: string;
  }

  interface PayTechCallbackData extends PaymentWebhookData {
    token: string;
    type: string;
  }

  namespace PDFKit {
    interface PDFDocument {
      fontSize(size: number): this;
      font(name: string): this;
      text(text: string, x?: number, y?: number, options?: any): this;
      moveDown(lines?: number): this;
      addPage(options?: any): this;
      image(src: string | Buffer, x?: number, y?: number, options?: any): this;
    }
  }
}

export {}; 