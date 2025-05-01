"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const formationRoutes_1 = __importDefault(require("./routes/formationRoutes"));
const subscriptions_1 = __importDefault(require("./routes/subscriptions"));
const payment_1 = __importDefault(require("./routes/payment"));
const health_1 = __importDefault(require("./routes/health"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/formations', formationRoutes_1.default);
app.use('/api/subscriptions', subscriptions_1.default);
app.use('/api/payments', payment_1.default);
app.use('/api/health', health_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is running' });
});
app.use(errorHandler_1.errorHandler);
mongoose_1.default.connect(config_1.config.MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(config_1.config.PORT, () => {
        console.log(`Server is running on port ${config_1.config.PORT}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=index.js.map