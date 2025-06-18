import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const handleMulterError = (err: any, _req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
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
}; 