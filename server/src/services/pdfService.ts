import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

interface InvoiceData {
  invoice_id: string;
  customer_name: string;
  customer_email: string;
  customer_address?: string;
  amount: number;
  currency: string;
  date: Date;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
}

export class PDFService {
  private readonly invoicesDir: string;

  constructor() {
    this.invoicesDir = path.join(__dirname, '../../../uploads/invoices');
    // Créer le dossier des factures s'il n'existe pas
    if (!fs.existsSync(this.invoicesDir)) {
      fs.mkdirSync(this.invoicesDir, { recursive: true });
    }
  }

  async generateAndSaveInvoice(data: InvoiceData): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const fileName = `facture-${data.invoice_id}.pdf`;
        const filePath = path.join(this.invoicesDir, fileName);
        const writeStream = fs.createWriteStream(filePath);

        // Gérer les événements du stream
        writeStream.on('finish', () => {
          resolve(filePath);
        });

        writeStream.on('error', (error) => {
          logger.error('Erreur lors de l\'écriture du fichier PDF:', error);
          reject(error);
        });

        // Pipe le PDF vers le fichier
        doc.pipe(writeStream);

        // Générer le contenu du PDF
        this.generateHeader(doc);
        this.generateCustomerInformation(doc, data);
        this.generateInvoiceTable(doc, data);
        this.generateFooter(doc);

        doc.end();
      } catch (error) {
        logger.error('Erreur lors de la génération du PDF:', error);
        reject(error);
      }
    });
  }

  async getInvoicePath(invoiceId: string): Promise<string | null> {
    const fileName = `facture-${invoiceId}.pdf`;
    const filePath = path.join(this.invoicesDir, fileName);
    
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    return null;
  }

  async deleteInvoice(invoiceId: string): Promise<boolean> {
    try {
      const filePath = await this.getInvoicePath(invoiceId);
      if (filePath) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Erreur lors de la suppression de la facture:', error);
      return false;
    }
  }

  private generateHeader(doc: PDFKit.PDFDocument) {
    doc
      .image('path/to/logo.png', 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(20)
      .text('BusinessConnect Sénégal', 110, 57)
      .fontSize(10)
      .text('BusinessConnect Sénégal', 200, 50, { align: 'right' })
      .text('123 Avenue Cheikh Anta Diop', 200, 65, { align: 'right' })
      .text('Dakar, Sénégal', 200, 80, { align: 'right' })
      .moveDown();
  }

  private generateCustomerInformation(doc: PDFKit.PDFDocument, data: InvoiceData) {
    doc
      .fillColor('#444444')
      .fontSize(20)
      .text('Facture', 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      .text('Numéro de facture:', 50, customerInformationTop)
      .font('Helvetica-Bold')
      .text(data.invoice_id, 150, customerInformationTop)
      .font('Helvetica')
      .text('Date:', 50, customerInformationTop + 15)
      .text(this.formatDate(data.date), 150, customerInformationTop + 15)
      .text('Montant dû:', 50, customerInformationTop + 30)
      .text(
        `${this.formatCurrency(data.total)} ${data.currency}`,
        150,
        customerInformationTop + 30
      )

      .font('Helvetica-Bold')
      .text(data.customer_name, 300, customerInformationTop)
      .font('Helvetica')
      .text(data.customer_email, 300, customerInformationTop + 15);

    if (data.customer_address) {
      doc.text(data.customer_address, 300, customerInformationTop + 30);
    }

    this.generateHr(doc, 252);
  }

  private generateInvoiceTable(doc: PDFKit.PDFDocument, data: InvoiceData) {
    let i;
    const invoiceTableTop = 330;

    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      invoiceTableTop,
      'Description',
      'Quantité',
      'Prix unitaire',
      'Total'
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    for (i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        item.description,
        item.quantity.toString(),
        this.formatCurrency(item.unit_price),
        this.formatCurrency(item.total)
      );

      this.generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    this.generateTableRow(
      doc,
      subtotalPosition,
      '',
      '',
      'Sous-total',
      this.formatCurrency(data.subtotal)
    );

    const taxPosition = subtotalPosition + 20;
    this.generateTableRow(
      doc,
      taxPosition,
      '',
      '',
      'TVA (18%)',
      this.formatCurrency(data.tax)
    );

    const totalPosition = taxPosition + 25;
    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      totalPosition,
      '',
      '',
      'Total',
      this.formatCurrency(data.total)
    );
    doc.font('Helvetica');
  }

  private generateFooter(doc: PDFKit.PDFDocument) {
    doc
      .fontSize(10)
      .text(
        'Le paiement est dû dans les 15 jours. Merci pour votre activité.',
        50,
        780,
        { align: 'center', width: 500 }
      );
  }

  private generateTableRow(
    doc: PDFKit.PDFDocument,
    y: number,
    description: string,
    quantity: string,
    unitPrice: string,
    total: string
  ) {
    doc
      .fontSize(10)
      .text(description, 50, y)
      .text(quantity, 280, y, { width: 90, align: 'right' })
      .text(unitPrice, 370, y, { width: 90, align: 'right' })
      .text(total, 0, y, { align: 'right' });
  }

  private generateHr(doc: PDFKit.PDFDocument, y: number) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  private formatCurrency(amount: number): string {
    return amount.toLocaleString('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export const pdfService = new PDFService(); 