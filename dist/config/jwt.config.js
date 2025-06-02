"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwtConfig = {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h',
    algorithm: 'HS256'
};
exports.default = jwtConfig;
//# sourceMappingURL=jwt.config.js.map