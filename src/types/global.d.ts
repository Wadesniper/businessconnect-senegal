import { Request, Response } from 'express';
import { Document } from 'mongoose';
import { PDFKit } from 'pdfkit';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      file?: any;
      files?: any;
    }
  }

  interface User extends Document {
    email: string;
    password: string;
    role: string;
    // autres propriétés utilisateur
  }

  interface PDFDocument extends PDFKit.PDFDocument {
    // extensions PDFKit personnalisées
  }

  interface PaymentResponse {
    success: boolean;
    token?: string;
    error?: string;
  }

  interface NotificationPayload {
    type: string;
    message: string;
    data?: any;
  }

  interface WebSocketMessage {
    type: string;
    payload: any;
  }

  interface FileUpload {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }

  interface Config {
    port: number;
    mongoUri: string;
    jwtSecret: string;
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      }
    };
    paytech: {
      apiKey: string;
      webhookSecret: string;
      baseUrl: string;
    };
  }

  interface HealthCheck {
    status: 'healthy' | 'unhealthy';
    timestamp: Date;
    services: {
      database: boolean;
      cache: boolean;
      email: boolean;
    };
  }
} 