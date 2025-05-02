"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const User_1 = require("../models/User");
const appError_1 = require("../utils/appError");
const protect = async (req, res, next) => {
    var _a;
    try {
        let token;
        if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new appError_1.AppError('Vous n\'êtes pas connecté', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            return next(new appError_1.AppError('L\'utilisateur n\'existe plus', 401));
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new appError_1.AppError('Token invalide', 401));
    }
};
exports.protect = protect;
//# sourceMappingURL=auth.js.map