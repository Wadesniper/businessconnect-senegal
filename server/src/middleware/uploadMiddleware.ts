import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import type { FileFilterCallback } from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuration de multer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

export { upload };

export const handleMulterError = (err: any, _req: Request, res: Response, next: NextFunction) => {
  import('multer').then(multerModule => {
    if (err instanceof multerModule.MulterError) {
      logger.error('Erreur Multer:', err);
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
      logger.error('Erreur lors du téléchargement:', err);
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }
    return next();
  });
}; 