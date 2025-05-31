"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const logger_1 = require("../utils/logger");
const zlib_1 = require("zlib");
const util_1 = require("util");
const stream_1 = require("stream");
const fs_1 = require("fs");
const os_1 = __importDefault(require("os"));
const zlib_2 = require("zlib");
const pipelineAsync = (0, util_1.promisify)(stream_1.pipeline);
const DATA_DIR = process.env.NODE_ENV === 'production'
    ? '/data' // Pour Railway
    : path_1.default.join(__dirname, '../../data');
const ARCHIVE_DIR = process.env.NODE_ENV === 'production'
    ? '/data/archives'
    : path_1.default.join(__dirname, '../../data/archives');
// Assurer que les répertoires existent
const ensureDirectories = async () => {
    const directories = [
        'users',
        'cvs',
        'formations',
        'jobs',
        'subscriptions',
        'archives'
    ];
    for (const dir of directories) {
        const dirPath = path_1.default.join(DATA_DIR, dir);
        await promises_1.default.mkdir(dirPath, { recursive: true });
    }
};
// Initialisation
ensureDirectories().catch(logger_1.logger.error);
class StorageService {
    static async save(collection, data) {
        const id = data.id || (0, uuid_1.v4)();
        const filePath = path_1.default.join(DATA_DIR, collection, `${id}.json`);
        await promises_1.default.writeFile(filePath, JSON.stringify({
            ...data,
            id,
            updatedAt: new Date().toISOString()
        }, null, 2));
        return id;
    }
    static async get(collection, id) {
        const filePath = path_1.default.join(DATA_DIR, collection, `${id}.json`);
        try {
            const data = await promises_1.default.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }
    static async find(collection, query = {}) {
        const dirPath = path_1.default.join(DATA_DIR, collection);
        const files = await promises_1.default.readdir(dirPath);
        const results = [];
        for (const file of files) {
            if (path_1.default.extname(file) === '.json') {
                const data = await this.get(collection, path_1.default.parse(file).name);
                if (this.matchesQuery(data, query)) {
                    results.push(data);
                }
            }
        }
        return results;
    }
    static async delete(collection, id) {
        const filePath = path_1.default.join(DATA_DIR, collection, `${id}.json`);
        try {
            await promises_1.default.unlink(filePath);
            return true;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return false;
            }
            throw error;
        }
    }
    static async update(collection, id, data) {
        const existing = await this.get(collection, id);
        if (!existing)
            return null;
        const updated = {
            ...existing,
            ...data,
            id,
            updatedAt: new Date().toISOString()
        };
        await this.save(collection, updated);
        return updated;
    }
    static matchesQuery(data, query) {
        return Object.entries(query).every(([key, value]) => {
            if (value instanceof RegExp) {
                return value.test(data[key]);
            }
            return data[key] === value;
        });
    }
    static async getWithCache(collection, id) {
        const cacheKey = `${collection}:${id}`;
        if (this.cache.has(cacheKey)) {
            const { data, timestamp } = this.cache.get(cacheKey);
            if (Date.now() - timestamp < this.cacheTimeout) {
                return data;
            }
            this.cache.delete(cacheKey);
        }
        const data = await this.get(collection, id);
        if (data) {
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
        }
        return data;
    }
    static async archive(collection, id) {
        const sourcePath = path_1.default.join(DATA_DIR, collection, `${id}.json`);
        const archivePath = path_1.default.join(ARCHIVE_DIR, collection, `${id}.json.gz`);
        try {
            // Créer le répertoire d'archive si nécessaire
            await promises_1.default.mkdir(path_1.default.dirname(archivePath), { recursive: true });
            // Compresser et archiver le fichier
            const gzip = (0, zlib_1.createGzip)();
            const source = (0, fs_1.createReadStream)(sourcePath);
            const destination = (0, fs_1.createWriteStream)(archivePath);
            await pipelineAsync(source, gzip, destination);
            // Supprimer le fichier original
            await promises_1.default.unlink(sourcePath);
            logger_1.logger.info(`Fichier archivé avec succès: ${collection}/${id}`);
            return true;
        }
        catch (error) {
            logger_1.logger.error(`Erreur lors de l'archivage: ${collection}/${id}`, error);
            return false;
        }
    }
    static async getArchived(collection, id) {
        const archivePath = path_1.default.join(ARCHIVE_DIR, collection, `${id}.json.gz`);
        try {
            // Décompresser et lire le fichier
            const tempPath = path_1.default.join(os_1.default.tmpdir(), `bc-temp-${id}.json`);
            const gunzip = (0, zlib_2.createGunzip)();
            const source = (0, fs_1.createReadStream)(archivePath);
            const destination = (0, fs_1.createWriteStream)(tempPath);
            await pipelineAsync(source, gunzip, destination);
            // Lire le fichier temporaire
            const data = await promises_1.default.readFile(tempPath, 'utf-8');
            // Nettoyer
            await promises_1.default.unlink(tempPath);
            return JSON.parse(data);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }
    // Méthode pour obtenir les statistiques d'utilisation
    static async getStats() {
        const stats = {
            totalFiles: 0,
            totalSize: 0,
            collections: {}
        };
        const collections = ['users', 'cvs', 'formations', 'jobs', 'subscriptions'];
        for (const collection of collections) {
            const dirPath = path_1.default.join(DATA_DIR, collection);
            try {
                const files = await promises_1.default.readdir(dirPath);
                let collectionSize = 0;
                for (const file of files) {
                    if (path_1.default.extname(file) === '.json') {
                        const filePath = path_1.default.join(dirPath, file);
                        const fileStats = await promises_1.default.stat(filePath);
                        collectionSize += fileStats.size;
                    }
                }
                stats.collections[collection] = {
                    files: files.length,
                    size: collectionSize
                };
                stats.totalFiles += files.length;
                stats.totalSize += collectionSize;
            }
            catch (error) {
                logger_1.logger.error(`Erreur lors du calcul des stats pour ${collection}:`, error);
            }
        }
        return stats;
    }
}
exports.StorageService = StorageService;
// Cache en mémoire pour les performances
StorageService.cache = new Map();
StorageService.cacheTimeout = 5 * 60 * 1000; // 5 minutes
