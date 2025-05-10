"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const ads_1 = __importDefault(require("./routes/ads"));
const payment_1 = __importDefault(require("./routes/payment"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        'https://app.businessconnectsenegal.com',
        'https://businessconnect-senegal.onrender.com',
        /\.vercel\.app$/,
        process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
    ].filter(Boolean),
    credentials: true
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', auth_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/ads', ads_1.default);
app.use('/api/payment', payment_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI n\'est pas défini dans les variables d\'environnement');
        }
        await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10
        });
        logger_1.logger.info('Connecté à MongoDB');
        const port = parseInt(process.env.PORT || '4000', 10);
        const server = app.listen(port, '0.0.0.0', () => {
            logger_1.logger.info(`Serveur démarré sur le port ${port}`);
        });
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger_1.logger.error(`Le port ${port} est déjà utilisé. Tentative avec un autre port...`);
                setTimeout(() => {
                    server.close();
                    server.listen(0, '0.0.0.0');
                }, 1000);
            }
            else {
                logger_1.logger.error('Erreur lors du démarrage du serveur:', error);
                process.exit(1);
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Erreur de connexion à la base de données:', error);
        process.exit(1);
    }
};
startServer();
process.on('unhandledRejection', (error) => {
    logger_1.logger.error('Erreur non gérée (Promise):', error);
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Exception non capturée:', error);
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
});
exports.default = app;
//# sourceMappingURL=index.js.map