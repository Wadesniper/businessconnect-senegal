import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${_file.fieldname}-${uniqueSuffix}${path.extname(_file.originalname)}`);
  }
});

// Filtre des fichiers
const fileFilter = (_req: Request, _file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
  } else {
    cb(new Error('Type de fichier non supporté'));
  }
};

// Configuration de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 5 // Maximum 5 fichiers
  }
});

// Middleware de gestion des erreurs Multer
export const handleMulterError = (err: any, _req: Request, res: Response, next: NextFunction) => {
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

export { upload }; 