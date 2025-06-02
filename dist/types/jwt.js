"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.defaultJWTConfig = void 0;
exports.defaultJWTConfig = {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h',
    algorithm: 'HS256'
};
const generateToken = (payload, secret, options = {}) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(payload, secret, {
        ...options,
        algorithm: 'HS256'
    });
};
exports.generateToken = generateToken;
const verifyToken = (token, secret) => {
    const jwt = require('jsonwebtoken');
    return jwt.verify(token, secret, {
        algorithms: ['HS256']
    });
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map