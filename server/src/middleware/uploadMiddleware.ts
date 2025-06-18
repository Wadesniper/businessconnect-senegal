import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let upload: any;

export async function getUploadMiddleware() {
  if (!upload) {
    const multerModule = await import('multer');
    const storage = multerModule.default.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      }
    });
    upload = multerModule.default({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 }
    });
  }
  return upload;
}

export const handleMulterError = async (err: any, _req: any, res: any, next: any) => {
  const multerModule = await import('multer');
  if (err instanceof multerModule.default.MulterError) {
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