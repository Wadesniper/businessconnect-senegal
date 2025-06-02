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
const uuid_1 = require("uuid");
const errors_1 = require("../utils/errors");
class CVService {
    constructor() {
        this.UPLOAD_DIR = 'uploads/cv';
        if (!fs_1.default.existsSync(this.UPLOAD_DIR)) {
            fs_1.default.mkdirSync(this.UPLOAD_DIR, { recursive: true });
        }
    }
    async generatePDF(cvData) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default();
                const chunks = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    const filename = `${(0, uuid_1.v4)()}.pdf`;
                    resolve({ buffer, filename });
                });
                this.applyTemplate(doc, cvData)
                    .then(() => doc.end())
                    .catch(reject);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async generateCV(cvData) {
        try {
            const { buffer } = await this.generatePDF(cvData);
            return buffer.toString('base64');
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la génération du CV:', error);
            throw new errors_1.AppError('Échec de la génération du CV', 500);
        }
    }
    async applyTemplate(doc, cv) {
        return new Promise((resolve) => {
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
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de l\'application du template:', error);
                throw new errors_1.AppError('Erreur lors de l\'application du template', 500);
            }
        });
    }
    applyModernTemplate(doc, cv) {
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
    applyClassicTemplate(doc, cv) {
        // Template classique
        this.applyModernTemplate(doc, cv); // Utiliser le même template pour l'instant
    }
    applyCreativeTemplate(doc, cv) {
        // Template créatif
        this.applyModernTemplate(doc, cv); // Utiliser le même template pour l'instant
    }
    applyProfessionalTemplate(doc, cv) {
        // Template professionnel
        this.applyModernTemplate(doc, cv); // Utiliser le même template pour l'instant
    }
    addExperienceSection(doc, cv) {
        if (cv.experience?.length > 0) {
            doc.moveDown()
                .fontSize(16)
                .fillColor(cv.color || '#000')
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
            });
        }
    }
    addEducationSection(doc, cv) {
        if (cv.education?.length > 0) {
            doc.moveDown()
                .fontSize(16)
                .fillColor(cv.color || '#000')
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
    }
    addSkillsSection(doc, cv) {
        if (cv.skills?.length > 0) {
            doc.moveDown()
                .fontSize(16)
                .fillColor(cv.color || '#000')
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
    }
    addLanguagesSection(doc, cv) {
        if (cv.languages?.length > 0) {
            doc.moveDown()
                .fontSize(16)
                .fillColor(cv.color || '#000')
                .text('Langues');
            doc.moveDown()
                .fontSize(11)
                .fillColor('#666')
                .text(cv.languages.map((lang) => `${lang.name} (${lang.level})`).join(' • '));
        }
    }
    static async createCV(userId, cvData) {
        try {
            const cv = await cv_1.CV.create({
                ...cvData,
                userId
            });
            return cv;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la création du CV:', error);
            throw new Error('Erreur lors de la création du CV');
        }
    }
    static async getCVsByUser(userId) {
        try {
            const cvs = await cv_1.CV.find({ userId });
            return cvs;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des CVs:', error);
            throw new Error('Erreur lors de la récupération des CVs');
        }
    }
    static async getCVById(cvId) {
        try {
            const cv = await cv_1.CV.findById(cvId);
            if (!cv) {
                throw new Error('CV non trouvé');
            }
            return cv;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération du CV:', error);
            throw new Error('Erreur lors de la récupération du CV');
        }
    }
    static async updateCV(cvId, userId, cvData) {
        try {
            const cv = await cv_1.CV.findOneAndUpdate({ _id: cvId, userId }, cvData, { new: true });
            if (!cv) {
                throw new Error('CV non trouvé');
            }
            return cv;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour du CV:', error);
            throw new Error('Erreur lors de la mise à jour du CV');
        }
    }
    static async deleteCV(cvId, userId) {
        try {
            const cv = await cv_1.CV.findOneAndDelete({ _id: cvId, userId });
            if (!cv) {
                throw new Error('CV non trouvé');
            }
            return cv;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression du CV:', error);
            throw new Error('Erreur lors de la suppression du CV');
        }
    }
}
exports.CVService = CVService;
//# sourceMappingURL=cvService.js.map