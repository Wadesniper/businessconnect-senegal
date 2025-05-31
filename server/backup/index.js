"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const user_1 = __importDefault(require("./routes/user"));
const formations_1 = __importDefault(require("./routes/formations"));
const health_1 = __importDefault(require("./routes/health"));
const users_1 = __importDefault(require("./routes/users"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config");
const jobs_1 = __importDefault(require("./routes/jobs"));
const subscriptions_1 = __importDefault(require("./routes/subscriptions"));
// import adminRoutes from './routes/admin.routes';
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware de sécurité
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(rateLimiter_1.rateLimiter);
// Routes
app.use('/api/health', health_1.default);
app.use('/api/users', user_1.default);
app.use('/api/formations', formations_1.default);
app.use('/api/auth', users_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/subscriptions', subscriptions_1.default);
// app.use('/api/admin', adminRoutes);
// Middleware de gestion d'erreurs
app.use(errorHandler_1.errorHandler);
// Connexion à MongoDB avec gestion d'erreur améliorée
mongoose_1.default.connect(config_1.config.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => {
    console.log('✅ Connecté à MongoDB avec succès');
    const port = config_1.config.PORT || 3001;
    app.listen(port, () => {
        console.log(`🚀 Serveur démarré sur le port ${port}`);
    });
})
    .catch((error) => {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
});
// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
    console.error('❌ Erreur non gérée:', error.message);
    process.exit(1);
});
exports.default = app;
