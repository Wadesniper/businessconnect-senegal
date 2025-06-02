import { PDFDocument } from 'pdfkit';

declare global {
  namespace PDFKit {
    interface PDFDocument extends PDFDocument {}
  }

  namespace Express {
    interface Multer {
      File: Express.Multer.File;
    }
  }
}

export {}; 