"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = require("./middleware/auth");
// Routes
const webhook_1 = __importDefault(require("./routes/webhook"));
const subscriptions_1 = __importDefault(require("./routes/subscriptions"));
const users_1 = __importDefault(require("./routes/users"));
const auth_2 = __importDefault(require("./routes/auth"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const marketplace_1 = __importDefault(require("./routes/marketplace"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware de sécurité de base
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Configuration CORS avec origines spécifiques
const allowedOrigins = [
    'https://businessconnectsenegal.com',
    'http://localhost:3000',
    'http://localhost:5173'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Permettre les requêtes sans origine (comme les appels API directs)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
// Rate limiting pour la sécurité
app.use(rateLimiter_1.rateLimiter);
// Routes publiques (pas besoin d'authentification)
app.use('/api/auth', auth_2.default);
app.use('/api/webhook', webhook_1.default); // Les webhooks doivent rester publics
// Routes avec authentification conditionnelle (certaines routes sont publiques, d'autres protégées)
app.use('/api/jobs', auth_1.authenticate, jobs_1.default);
app.use('/api/marketplace', marketplace_1.default);
// Routes complètement protégées (nécessitent toujours une authentification)
app.use('/api/subscriptions', auth_1.authenticate, subscriptions_1.default);
app.use('/api/users', auth_1.authenticate, users_1.default);
// Middleware de gestion d'erreurs (toujours en dernier)
app.use(errorHandler_1.errorHandler);
// Database connection
if (process.env.NODE_ENV !== 'test') {
    mongoose_1.default
        .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect')
        .then(() => {
        console.log('Connected to MongoDB');
    })
        .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
}
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
