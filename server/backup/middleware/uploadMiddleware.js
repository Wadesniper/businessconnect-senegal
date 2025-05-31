"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.handleMulterError = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
// Configuration du stockage
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../uploads'));
    },
    filename: (_req, _file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${_file.fieldname}-${uniqueSuffix}${path_1.default.extname(_file.originalname)}`);
    }
});
// Filtre des fichiers
const fileFilter = (_req, _file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimes.includes(_file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Type de fichier non supporté'));
    }
};
// Configuration de Multer
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
        files: 5 // Maximum 5 fichiers
    }
});
exports.upload = upload;
// Middleware de gestion des erreurs Multer
const handleMulterError = (err, _req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        logger_1.logger.error('Erreur Multer:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'Le fichier est trop volumineux. Taille maximum: 5MB'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                status: 'error',
                message: 'Trop de fichiers. Maximum: 5 fichiers'
            });
        }
        return res.status(400).json({
            status: 'error',
            message: 'Erreur lors du téléchargement du fichier'
        });
    }
    if (err) {
        logger_1.logger.error('Erreur lors du téléchargement:', err);
        return res.status(400).json({
            status: 'error',
            message: err.message
        });
    }
    return next();
};
exports.handleMulterError = handleMulterError;
