"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const formationRoutes_1 = __importDefault(require("./routes/formationRoutes"));
const subscriptions_1 = __importDefault(require("./routes/subscriptions"));
const payment_1 = __importDefault(require("./routes/payment"));
const health_1 = __importDefault(require("./routes/health"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/formations', formationRoutes_1.default);
app.use('/api/subscriptions', subscriptions_1.default);
app.use('/api/payments', payment_1.default);
app.use('/api/health', health_1.default);
app.get('/', (_req, res) => {
    res.json({
        status: 'success',
        message: 'BusinessConnect Sénégal API est en ligne!'
    });
});
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'success',
        message: 'Service en ligne'
    });
});
app.use(errorHandler_1.errorHandler);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('Connecté à MongoDB');
    app.listen(config_1.config.PORT, () => {
        console.log(`Serveur démarré sur le port ${config_1.config.PORT}`);
    });
})
    .catch((error) => {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=index.js.map