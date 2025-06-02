"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = exports.StorageService = void 0;
const logger_1 = require("../utils/logger");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class StorageService {
    constructor() {
        this.tempDir = path_1.default.join(process.cwd(), 'temp');
    }
    async cleanupTempFiles() {
        try {
            const files = await promises_1.default.readdir(this.tempDir);
            for (const file of files) {
                const filePath = path_1.default.join(this.tempDir, file);
                const stats = await promises_1.default.stat(filePath);
                // Supprime les fichiers de plus de 24h
                const fileAge = Date.now() - stats.mtime.getTime();
                if (fileAge > 24 * 60 * 60 * 1000) {
                    await promises_1.default.unlink(filePath);
                    logger_1.logger.info(`Fichier temporaire supprimé: ${file}`);
                }
            }
        }
        catch (error) {
            logger_1.logger.error('Erreur lors du nettoyage des fichiers temporaires:', error);
        }
    }
}
exports.StorageService = StorageService;
class MonitoringService {
    constructor() {
        this.storage = new StorageService();
    }
    async startMonitoring() {
        // Nettoie les fichiers temporaires toutes les 6 heures
        setInterval(() => {
            this.storage.cleanupTempFiles();
        }, 6 * 60 * 60 * 1000);
    }
}
exports.MonitoringService = MonitoringService;
//# sourceMappingURL=monitoringService.js.map