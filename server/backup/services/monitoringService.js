"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const logger_1 = require("../utils/logger");
const os_1 = __importDefault(require("os"));
const promises_1 = __importDefault(require("fs/promises"));
class MonitoringService {
    constructor() {
        this.checkInterval = 30000; // 30 secondes
        this.memoryThreshold = 0.85; // 85% d'utilisation mémoire
        this.diskThreshold = 0.80; // 80% d'utilisation disque
        this.cpuThreshold = 0.70; // 70% d'utilisation CPU
        this.startMonitoring();
    }
    static getInstance() {
        if (!MonitoringService.instance) {
            MonitoringService.instance = new MonitoringService();
        }
        return MonitoringService.instance;
    }
    async startMonitoring() {
        setInterval(async () => {
            try {
                const metrics = await this.collectMetrics();
                await this.handleMetrics(metrics);
                this.logMetrics(metrics);
            }
            catch (error) {
                logger_1.logger.error('Erreur lors du monitoring:', error);
            }
        }, this.checkInterval);
    }
    async collectMetrics() {
        const totalMemory = os_1.default.totalmem();
        const freeMemory = os_1.default.freemem();
        const memoryUsage = (totalMemory - freeMemory) / totalMemory;
        const cpuUsage = os_1.default.loadavg()[0] / os_1.default.cpus().length;
        const cacheStats = { size: 0, memoryUsage: 0 };
        const diskSpace = await this.checkDiskSpace(process.env.NODE_ENV === 'production' ? '/data' : './data');
        return {
            memoryUsage,
            cpuUsage,
            diskUsage: diskSpace.usage,
            cacheSize: cacheStats.size,
            cacheMemoryUsage: cacheStats.memoryUsage,
            timestamp: new Date().toISOString()
        };
    }
    async handleMetrics(metrics) {
        if (metrics.memoryUsage > this.memoryThreshold) {
            logger_1.logger.warn('Usage mémoire élevé, nettoyage mémoire désactivé');
            // await this.optimizeMemory();
        }
        if (metrics.cpuUsage > this.cpuThreshold) {
            logger_1.logger.warn('Usage CPU élevé, optimisation CPU désactivée');
            // await this.optimizeCPU();
        }
        if (metrics.diskUsage > this.diskThreshold) {
            logger_1.logger.warn('Espace disque faible, nettoyage...');
            // await this.optimizeDiskSpace();
        }
    }
    logMetrics(metrics) {
        logger_1.logger.info('Métriques système:', {
            memoryUsage: `${(metrics.memoryUsage * 100).toFixed(2)}%`,
            cpuUsage: `${(metrics.cpuUsage * 100).toFixed(2)}%`,
            diskUsage: `${(metrics.diskUsage * 100).toFixed(2)}%`,
            cacheSize: `${metrics.cacheSize} items`,
            cacheMemoryUsage: `${(metrics.cacheMemoryUsage / 1024 / 1024).toFixed(2)} MB`
        });
    }
    async checkDiskSpace(path) {
        try {
            const stats = await promises_1.default.statfs(path);
            const total = stats.blocks * stats.bsize;
            const free = stats.bfree * stats.bsize;
            const usage = (total - free) / total;
            return { total, free, usage };
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la vérification de l\'espace disque:', error);
            return { total: 0, free: 0, usage: 0 };
        }
    }
}
exports.MonitoringService = MonitoringService;
