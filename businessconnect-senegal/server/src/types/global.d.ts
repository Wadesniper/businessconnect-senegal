declare module 'pdfkit' {
  import { PDFDocument } from 'pdfkit';
  export = PDFDocument;
}

declare module './inAppNotificationService' {
  export class InAppNotificationService {
    createNotification(userId: string, type: string, title: string, message: string, metadata?: any): Promise<void>;
  }
}

declare namespace Express {
  export interface Request {
    user?: any;
  }
} 