"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const logger_1 = require("../utils/logger");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
class PdfService {
    constructor() {
        this.tempDir = path_1.default.join(process.cwd(), 'temp');
        this.ensureTempDirExists();
    }
    async ensureTempDirExists() {
        try {
            await promises_1.default.access(this.tempDir);
        }
        catch {
            await promises_1.default.mkdir(this.tempDir, { recursive: true });
        }
    }
    async generatePdf(html, options = {}) {
        let browser;
        try {
            browser = await puppeteer_1.default.launch({
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
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la génération du PDF:', error);
            throw new Error('Erreur lors de la génération du PDF');
        }
        finally {
            if (browser) {
                await browser.close();
            }
        }
    }
    async savePdfToFile(pdfBuffer, filename) {
        const filePath = path_1.default.join(this.tempDir, filename);
        try {
            await promises_1.default.writeFile(filePath, pdfBuffer);
            return filePath;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la sauvegarde du PDF:', error);
            throw new Error('Erreur lors de la sauvegarde du PDF');
        }
    }
    async deletePdf(filename) {
        const filePath = path_1.default.join(this.tempDir, filename);
        try {
            await promises_1.default.unlink(filePath);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression du PDF:', error);
        }
    }
}
exports.PdfService = PdfService;
//# sourceMappingURL=pdfService.js.map