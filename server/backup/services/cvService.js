"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CVService = void 0;
const cv_1 = require("../models/cv");
const logger_1 = require("../utils/logger");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
class CVService {
    constructor() {
        this.UPLOAD_DIR = 'uploads/cv';
        // Créer le dossier d'upload s'il n'existe pas
        if (!fs_1.default.existsSync(this.UPLOAD_DIR)) {
            fs_1.default.mkdirSync(this.UPLOAD_DIR, { recursive: true });
        }
    }
    async createCV(userId, data) {
        try {
            const cv = new cv_1.CV({
                userId,
                ...data
            });
            await cv.save();
            return cv.toObject();
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la création du CV:', error);
            throw error;
        }
    }
    async updateCV(cvId, userId, data) {
        try {
            const cv = await cv_1.CV.findOneAndUpdate({ _id: cvId, userId }, { $set: data }, { new: true });
            return cv ? cv.toObject() : null;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour du CV:', error);
            throw error;
        }
    }
    async getCV(cvId, userId) {
        try {
            const cv = await cv_1.CV.findOne({ _id: cvId, userId });
            return cv ? cv.toObject() : null;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération du CV:', error);
            throw error;
        }
    }
    async getUserCVs(userId) {
        try {
            const cvs = await cv_1.CV.find({ userId }).sort({ updatedAt: -1 });
            return cvs.map(cv => cv.toObject());
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des CVs:', error);
            throw error;
        }
    }
    async deleteCV(cvId, userId) {
        try {
            const cv = await cv_1.CV.findOne({ _id: cvId, userId });
            if (!cv)
                return false;
            // Supprimer le fichier PDF s'il existe
            if (cv.pdfUrl) {
                const pdfPath = path_1.default.join(process.cwd(), cv.pdfUrl);
                if (fs_1.default.existsSync(pdfPath)) {
                    fs_1.default.unlinkSync(pdfPath);
                }
            }
            await cv.deleteOne();
            return true;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression du CV:', error);
            throw error;
        }
    }
    async generatePDF(cvId, userId) {
        try {
            const cv = await cv_1.CV.findOne({ _id: cvId, userId });
            if (!cv)
                throw new Error('CV non trouvé');
            const doc = new pdfkit_1.default();
            const filename = `${(0, uuid_1.v4)()}.pdf`;
            const outputPath = path_1.default.join(this.UPLOAD_DIR, filename);
            const writeStream = fs_1.default.createWriteStream(outputPath);
            // Créer le PDF selon le template choisi
            await this.applyTemplate(doc, cv);
            // Sauvegarder le PDF
            doc.pipe(writeStream);
            doc.end();
            await new Promise((resolve, reject) => {
                writeStream.on('finish', () => resolve());
                writeStream.on('error', reject);
            });
            // Mettre à jour l'URL du PDF dans le CV
            const pdfUrl = path_1.default.join(this.UPLOAD_DIR, filename);
            cv.pdfUrl = pdfUrl;
            cv.lastGenerated = new Date();
            await cv.save();
            return pdfUrl;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la génération du PDF:', error);
            throw error;
        }
    }
    async generateCV(cvData) {
        try {
            const pdfPath = await this.generatePDF(cvData, '');
            return pdfPath;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la génération du CV:', error);
            throw new Error('Échec de la génération du CV');
        }
    }
    async applyTemplate(doc, cv) {
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
    async applyModernTemplate(doc, cv) {
        // En-tête
        doc.fontSize(24)
            .fillColor(cv.color)
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
                .fillColor(cv.color)
                .text('Expérience Professionnelle');
            cv.experience.forEach((exp) => {
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
                if (exp.achievements && exp.achievements.length > 0) {
                    doc.moveDown(0.5);
                    exp.achievements.forEach((achievement) => {
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
                .fillColor(cv.color)
                .text('Formation');
            cv.education.forEach((edu) => {
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
                .fillColor(cv.color)
                .text('Compétences');
            const skillsByCategory = cv.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) {
                    acc[skill.category] = [];
                }
                acc[skill.category].push(skill);
                return acc;
            }, {});
            Object.entries(skillsByCategory).forEach(([category, skills]) => {
                doc.moveDown()
                    .fontSize(12)
                    .fillColor('#333')
                    .text(category.charAt(0).toUpperCase() + category.slice(1));
                doc.fontSize(11)
                    .fillColor('#666')
                    .text(skills.map((s) => `${s.name} (${s.level})`).join(' • '));
            });
        }
        // Langues
        if (cv.languages && cv.languages.length > 0) {
            doc.moveDown()
                .fontSize(16)
                .fillColor(cv.color)
                .text('Langues');
            doc.moveDown()
                .fontSize(11)
                .fillColor('#666')
                .text(cv.languages.map((lang) => `${lang.name} (${lang.level})`).join(' • '));
        }
        // Certifications
        if (cv.certifications && cv.certifications.length > 0) {
            doc.moveDown()
                .fontSize(16)
                .fillColor(cv.color)
                .text('Certifications');
            cv.certifications.forEach((cert) => {
                doc.moveDown()
                    .fontSize(12)
                    .fillColor('#333')
                    .text(cert.name)
                    .fontSize(11)
                    .fillColor('#666')
                    .text(`${cert.issuer} | ${new Date(cert.date).toLocaleDateString('fr-FR')}`);
                if (cert.credentialUrl) {
                    doc.fontSize(10)
                        .fillColor('#0066cc')
                        .text(cert.credentialUrl, { link: cert.credentialUrl });
                }
            });
        }
    }
    async applyClassicTemplate(_, __) {
        // Implémentation similaire au template moderne mais avec un style plus classique
        // À implémenter selon les besoins
    }
    async applyCreativeTemplate(_, __) {
        // Template créatif avec plus de couleurs et de mise en page dynamique
        // À implémenter selon les besoins
    }
    async applyProfessionalTemplate(_, __) {
        // Template professionnel avec une mise en page sobre et élégante
        // À implémenter selon les besoins
    }
}
exports.CVService = CVService;
