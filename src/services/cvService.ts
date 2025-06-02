import { CV } from '../models/cv';
import { IUser } from '../models/User';
import { logger } from '../utils/logger';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/errors';

interface PDFGenerationResult {
  buffer: Buffer;
  filename: string;
}

export class CVService {
  private readonly UPLOAD_DIR = 'uploads/cv';

  constructor() {
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
  }

  async generatePDF(cvData: any): Promise<PDFGenerationResult> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const filename = `${uuidv4()}.pdf`;
          resolve({ buffer, filename });
        });

        this.applyTemplate(doc, cvData)
          .then(() => doc.end())
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateCV(cvData: any): Promise<string> {
    try {
      const { buffer } = await this.generatePDF(cvData);
      return buffer.toString('base64');
    } catch (error) {
      logger.error('Erreur lors de la génération du CV:', error);
      throw new AppError('Échec de la génération du CV', 500);
    }
  }

  private async applyTemplate(doc: PDFKit.PDFDocument, cv: any): Promise<void> {
    return new Promise<void>((resolve) => {
      try {
        switch (cv.template) {
          case 'modern':
            this.applyModernTemplate(doc, cv);
            break;
          case 'classic':
            this.applyClassicTemplate(doc, cv);
            break;
          case 'creative':
            this.applyCreativeTemplate(doc, cv);
            break;
          case 'professional':
            this.applyProfessionalTemplate(doc, cv);
            break;
          default:
            this.applyClassicTemplate(doc, cv);
        }
        resolve();
      } catch (error) {
        logger.error('Erreur lors de l\'application du template:', error);
        throw new AppError('Erreur lors de l\'application du template', 500);
      }
    });
  }

  private applyModernTemplate(doc: PDFKit.PDFDocument, cv: any): void {
    // En-tête
    doc.fontSize(24)
      .fillColor(cv.color || '#000')
      .text(`${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`, { align: 'center' });

    if (cv.personalInfo.title) {
      doc.fontSize(16)
        .fillColor('#666')
        .text(cv.personalInfo.title, { align: 'center' });
    }

    // Informations de contact
    doc.moveDown()
      .fontSize(10)
      .fillColor('#333');

    const contactInfo = [
      cv.personalInfo.email,
      cv.personalInfo.phone,
      [cv.personalInfo.city, cv.personalInfo.country].filter(Boolean).join(', ')
    ].filter(Boolean);

    doc.text(contactInfo.join(' | '), { align: 'center' });

    // Sections du CV
    this.addExperienceSection(doc, cv);
    this.addEducationSection(doc, cv);
    this.addSkillsSection(doc, cv);
    this.addLanguagesSection(doc, cv);
  }

  private applyClassicTemplate(doc: PDFKit.PDFDocument, cv: any): void {
    // Template classique
    this.applyModernTemplate(doc, cv); // Utiliser le même template pour l'instant
  }

  private applyCreativeTemplate(doc: PDFKit.PDFDocument, cv: any): void {
    // Template créatif
    this.applyModernTemplate(doc, cv); // Utiliser le même template pour l'instant
  }

  private applyProfessionalTemplate(doc: PDFKit.PDFDocument, cv: any): void {
    // Template professionnel
    this.applyModernTemplate(doc, cv); // Utiliser le même template pour l'instant
  }

  private addExperienceSection(doc: PDFKit.PDFDocument, cv: any): void {
    if (cv.experience?.length > 0) {
      doc.moveDown()
        .fontSize(16)
        .fillColor(cv.color || '#000')
        .text('Expérience Professionnelle');

      cv.experience.forEach((exp: any) => {
        doc.moveDown()
          .fontSize(14)
          .fillColor('#333')
          .text(exp.position)
          .fontSize(12)
          .fillColor('#666')
          .text(`${exp.company} | ${exp.location || ''}`)
          .fontSize(10)
          .text(`${new Date(exp.startDate).toLocaleDateString('fr-FR')} - ${exp.current ? 'Présent' : new Date(exp.endDate).toLocaleDateString('fr-FR')}`);

        if (exp.description) {
          doc.moveDown(0.5)
            .fontSize(11)
            .fillColor('#333')
            .text(exp.description);
        }
      });
    }
  }

  private addEducationSection(doc: PDFKit.PDFDocument, cv: any): void {
    if (cv.education?.length > 0) {
      doc.moveDown()
        .fontSize(16)
        .fillColor(cv.color || '#000')
        .text('Formation');

      cv.education.forEach((edu: any) => {
        doc.moveDown()
          .fontSize(14)
          .fillColor('#333')
          .text(edu.degree)
          .fontSize(12)
          .fillColor('#666')
          .text(`${edu.school} | ${edu.location || ''}`)
          .fontSize(10)
          .text(`${new Date(edu.startDate).toLocaleDateString('fr-FR')} - ${edu.endDate ? new Date(edu.endDate).toLocaleDateString('fr-FR') : 'Présent'}`);

        if (edu.description) {
          doc.moveDown(0.5)
            .fontSize(11)
            .fillColor('#333')
            .text(edu.description);
        }
      });
    }
  }

  private addSkillsSection(doc: PDFKit.PDFDocument, cv: any): void {
    if (cv.skills?.length > 0) {
      doc.moveDown()
        .fontSize(16)
        .fillColor(cv.color || '#000')
        .text('Compétences');

      const skillsByCategory = cv.skills.reduce((acc: any, skill: any) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {});

      Object.entries(skillsByCategory).forEach(([category, skills]: [string, any]) => {
        doc.moveDown()
          .fontSize(12)
          .fillColor('#333')
          .text(category.charAt(0).toUpperCase() + category.slice(1));

        doc.fontSize(11)
          .fillColor('#666')
          .text(skills.map((s: any) => `${s.name} (${s.level})`).join(' • '));
      });
    }
  }

  private addLanguagesSection(doc: PDFKit.PDFDocument, cv: any): void {
    if (cv.languages?.length > 0) {
      doc.moveDown()
        .fontSize(16)
        .fillColor(cv.color || '#000')
        .text('Langues');

      doc.moveDown()
        .fontSize(11)
        .fillColor('#666')
        .text(cv.languages.map((lang: any) => `${lang.name} (${lang.level})`).join(' • '));
    }
  }

  static async createCV(userId: string, cvData: any) {
    try {
      const cv = await CV.create({
        ...cvData,
        userId
      });
      return cv;
    } catch (error) {
      logger.error('Erreur lors de la création du CV:', error);
      throw new Error('Erreur lors de la création du CV');
    }
  }

  static async getCVsByUser(userId: string) {
    try {
      const cvs = await CV.find({ userId });
      return cvs;
    } catch (error) {
      logger.error('Erreur lors de la récupération des CVs:', error);
      throw new Error('Erreur lors de la récupération des CVs');
    }
  }

  static async getCVById(cvId: string) {
    try {
      const cv = await CV.findById(cvId);
      if (!cv) {
        throw new Error('CV non trouvé');
      }
      return cv;
    } catch (error) {
      logger.error('Erreur lors de la récupération du CV:', error);
      throw new Error('Erreur lors de la récupération du CV');
    }
  }

  static async updateCV(cvId: string, userId: string, cvData: any) {
    try {
      const cv = await CV.findOneAndUpdate(
        { _id: cvId, userId },
        cvData,
        { new: true }
      );
      if (!cv) {
        throw new Error('CV non trouvé');
      }
      return cv;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du CV:', error);
      throw new Error('Erreur lors de la mise à jour du CV');
    }
  }

  static async deleteCV(cvId: string, userId: string) {
    try {
      const cv = await CV.findOneAndDelete({ _id: cvId, userId });
      if (!cv) {
        throw new Error('CV non trouvé');
      }
      return cv;
    } catch (error) {
      logger.error('Erreur lors de la suppression du CV:', error);
      throw new Error('Erreur lors de la suppression du CV');
    }
  }
} 