import { CV } from '../models/cv';
import { logger } from '../utils/logger';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CVData, PersonalInfo, Experience, Education, Skill, Language, Certification, Project, CustomSection } from '../types/cv';

export class CVService {
  private readonly UPLOAD_DIR = 'uploads/cv';

  constructor() {
    // Créer le dossier d'upload s'il n'existe pas
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
  }

  async createCV(userId: string, data: CVData) {
    try {
      const cv = new CV({
        userId,
        ...data
      });
      await cv.save();
      return cv.toObject();
    } catch (error) {
      logger.error('Erreur lors de la création du CV:', error);
      throw error;
    }
  }

  async updateCV(cvId: string, userId: string, data: Partial<CVData>) {
    try {
      const cv = await CV.findOneAndUpdate(
        { _id: cvId, userId },
        { $set: data },
        { new: true }
      );
      return cv ? cv.toObject() : null;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du CV:', error);
      throw error;
    }
  }

  async getCV(cvId: string, userId: string) {
    try {
      const cv = await CV.findOne({ _id: cvId, userId });
      return cv ? cv.toObject() : null;
    } catch (error) {
      logger.error('Erreur lors de la récupération du CV:', error);
      throw error;
    }
  }

  async getUserCVs(userId: string) {
    try {
      const cvs = await CV.find({ userId }).sort({ updatedAt: -1 });
      return cvs.map(cv => cv.toObject());
    } catch (error) {
      logger.error('Erreur lors de la récupération des CVs:', error);
      throw error;
    }
  }

  async deleteCV(cvId: string, userId: string) {
    try {
      const cv = await CV.findOne({ _id: cvId, userId });
      if (!cv) return false;

      // Supprimer le fichier PDF s'il existe
      if (cv.pdfUrl) {
        const pdfPath = path.join(process.cwd(), cv.pdfUrl);
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
        }
      }

      await cv.deleteOne();
      return true;
    } catch (error) {
      logger.error('Erreur lors de la suppression du CV:', error);
      throw error;
    }
  }

  async generatePDF(cvId: string, userId: string) {
    try {
      const cv = await CV.findOne({ _id: cvId, userId });
      if (!cv) throw new Error('CV non trouvé');

      const doc = new PDFDocument();
      const filename = `${uuidv4()}.pdf`;
      const outputPath = path.join(this.UPLOAD_DIR, filename);
      const writeStream = fs.createWriteStream(outputPath);

      // Créer le PDF selon le template choisi
      await this.applyTemplate(doc, cv.toObject() as CVData);

      // Sauvegarder le PDF
      doc.pipe(writeStream);
      doc.end();

      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      // Mettre à jour l'URL du PDF dans le CV
      const pdfUrl = path.join(this.UPLOAD_DIR, filename);
      cv.pdfUrl = pdfUrl;
      cv.lastGenerated = new Date();
      await cv.save();

      return pdfUrl;
    } catch (error) {
      logger.error('Erreur lors de la génération du PDF:', error);
      throw error;
    }
  }

  async generateCV(cvData: CVData): Promise<string> {
    try {
      const pdfBuffer = await this.generatePDFfromData(cvData);
      return pdfBuffer.toString('base64');
    } catch (error) {
      logger.error('Erreur lors de la génération du CV:', error);
      throw new Error('Échec de la génération du CV');
    }
  }

  private async generatePDFfromData(cvData: CVData): Promise<Buffer> {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    await this.applyTemplate(doc, cvData);
    doc.end();
    await new Promise(resolve => doc.on('end', resolve));
    return Buffer.concat(buffers);
  }

  private async applyTemplate(doc: PDFKit.PDFDocument, cv: CVData) {
    switch (cv.template) {
      case 'modern':
        await this.applyModernTemplate(doc, cv);
        break;
      case 'classic':
        await this.applyClassicTemplate(doc, cv);
        break;
      case 'creative':
        await this.applyCreativeTemplate(doc, cv);
        break;
      case 'professional':
        await this.applyProfessionalTemplate(doc, cv);
        break;
      default:
        await this.applyClassicTemplate(doc, cv);
    }
  }

  private async applyModernTemplate(doc: PDFKit.PDFDocument, cv: CVData) {
    // En-tête
    doc.fontSize(24)
      .fillColor(cv.color || '#2196f3')
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

    // Résumé
    if (cv.personalInfo.summary) {
      doc.moveDown()
        .fontSize(12)
        .text(cv.personalInfo.summary);
    }

    // Expérience professionnelle
    if (cv.experience && cv.experience.length > 0) {
      doc.moveDown()
        .fontSize(16)
        .fillColor(cv.color || '#2196f3')
        .text('Expérience Professionnelle');

      cv.experience.forEach((exp: Experience) => {
        doc.moveDown()
          .fontSize(14)
          .fillColor('#333')
          .text(exp.position)
          .fontSize(12)
          .fillColor('#666')
          .text(`${exp.company} | ${exp.location || ''}`)
          .fontSize(10)
          .text(`${new Date(exp.startDate).toLocaleDateString('fr-FR')} - ${exp.current ? 'Présent' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('fr-FR') : ''}`);

        if (exp.description) {
          doc.moveDown(0.5)
            .fontSize(11)
            .fillColor('#333')
            .text(exp.description);
        }

        if (exp.achievements && exp.achievements.length > 0) {
          doc.moveDown(0.5);
          exp.achievements.forEach((achievement: string) => {
            doc.fontSize(11)
              .text(`• ${achievement}`);
          });
        }
      });
    }

    // Formation
    if (cv.education && cv.education.length > 0) {
      doc.moveDown()
        .fontSize(16)
        .fillColor(cv.color || '#2196f3')
        .text('Formation');

      cv.education.forEach((edu: Education) => {
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

    // Compétences
    if (cv.skills && cv.skills.length > 0) {
      doc.moveDown()
        .fontSize(16)
        .fillColor(cv.color || '#2196f3')
        .text('Compétences');
      cv.skills.forEach((skill: Skill) => {
        doc.fontSize(12)
          .fillColor('#333')
          .text(`• ${skill.name} (${skill.level})`);
      });
    }

    // Langues
    if (cv.languages && cv.languages.length > 0) {
      doc.moveDown()
        .fontSize(16)
        .fillColor(cv.color || '#2196f3')
        .text('Langues');
      cv.languages.forEach((lang: Language) => {
        doc.fontSize(12)
          .fillColor('#333')
          .text(`• ${lang.name} (${lang.level})`);
      });
    }

    // Certifications
    if (cv.certifications && cv.certifications.length > 0) {
      doc.moveDown()
        .fontSize(16)
        .fillColor(cv.color || '#2196f3')
        .text('Certifications');
      cv.certifications.forEach((cert: Certification) => {
        doc.fontSize(12)
          .fillColor('#333')
          .text(`• ${cert.name} (${cert.issuer}, ${new Date(cert.date).getFullYear()})`);
      });
    }

    // Projets
    if (cv.projects && cv.projects.length > 0) {
      doc.moveDown()
        .fontSize(16)
        .fillColor(cv.color || '#2196f3')
        .text('Projets');
      cv.projects.forEach((proj: Project) => {
        doc.fontSize(12)
          .fillColor('#333')
          .text(`• ${proj.name}${proj.url ? ' (' + proj.url + ')' : ''}`);
      });
    }

    // Sections personnalisées
    if (cv.customSections && cv.customSections.length > 0) {
      cv.customSections.forEach((section: CustomSection) => {
        doc.moveDown()
          .fontSize(16)
          .fillColor(cv.color || '#2196f3')
          .text(section.title)
          .fontSize(12)
          .fillColor('#333')
          .text(section.content);
      });
    }
  }

  private async applyClassicTemplate(doc: PDFKit.PDFDocument, cv: CVData) {
    // Implémentation similaire au template moderne mais avec un style plus classique
    // À implémenter selon les besoins
  }

  private async applyCreativeTemplate(doc: PDFKit.PDFDocument, cv: CVData) {
    // Template créatif avec plus de couleurs et de mise en page dynamique
    // À implémenter selon les besoins
  }

  private async applyProfessionalTemplate(doc: PDFKit.PDFDocument, cv: CVData) {
    // Template professionnel avec une mise en page sobre et élégante
    // À implémenter selon les besoins
  }
} 