import puppeteer from 'puppeteer';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs/promises';

export class PdfService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp');
    this.ensureTempDirExists();
  }

  private async ensureTempDirExists(): Promise<void> {
    try {
      await fs.access(this.tempDir);
    } catch {
      await fs.mkdir(this.tempDir, { recursive: true });
    }
  }

  async generatePdf(html: string, options = {}): Promise<Buffer> {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        ...options
      });

      return pdfBuffer;
    } catch (error) {
      logger.error('Erreur lors de la génération du PDF:', error);
      throw new Error('Erreur lors de la génération du PDF');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async savePdfToFile(pdfBuffer: Buffer, filename: string): Promise<string> {
    const filePath = path.join(this.tempDir, filename);
    try {
      await fs.writeFile(filePath, pdfBuffer);
      return filePath;
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde du PDF:', error);
      throw new Error('Erreur lors de la sauvegarde du PDF');
    }
  }

  async deletePdf(filename: string): Promise<void> {
    const filePath = path.join(this.tempDir, filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.error('Erreur lors de la suppression du PDF:', error);
    }
  }
} 