import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export const checkInvoiceAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('Non autorisé', 401);
    }

    // Vérifier que l'utilisateur a accès à cette facture
    const invoice = await query(`
      SELECT * FROM invoices WHERE id = $1 AND user_id = $2
    `, [id, userId]);

    if (invoice.rows.length === 0) {
      throw new AppError('Facture non trouvée ou accès non autorisé', 404);
    }

    // Ajouter les informations de la facture à la requête
    req.invoice = invoice.rows[0];
    next();
  } catch (error) {
    logger.error('Erreur lors de la vérification de l\'accès à la facture:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la vérification de l\'accès à la facture'
      });
    }
  }
}; 