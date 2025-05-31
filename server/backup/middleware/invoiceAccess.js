"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInvoiceAccess = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const checkInvoiceAccess = async (req, res, next) => {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new errors_1.AppError('Non autorisé', 401);
        }
        const invoice = await (0, database_1.query)(`
      SELECT * FROM invoices WHERE id = $1 AND user_id = $2
    `, [id, userId]);
        if (invoice.rows.length === 0) {
            throw new errors_1.AppError('Facture non trouvée ou accès non autorisé', 404);
        }
        res.locals.invoice = invoice.rows[0];
        next();
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de la vérification de l\'accès à la facture:', error);
        if (error instanceof errors_1.AppError) {
            res.status(error.statusCode).json({
                status: 'error',
                message: error.message
            });
        }
        else {
            res.status(500).json({
                status: 'error',
                message: 'Erreur lors de la vérification de l\'accès à la facture'
            });
        }
    }
};
exports.checkInvoiceAccess = checkInvoiceAccess;
//# sourceMappingURL=invoiceAccess.js.map