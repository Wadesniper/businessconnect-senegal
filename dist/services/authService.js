"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../models/User");
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const appError_1 = require("../utils/appError");
class AuthService {
    static async validateUser(email, password) {
        try {
            const user = await User_1.User.findOne({ email }).select('+password');
            if (!user)
                return null;
            const isValid = await user.comparePassword(password);
            return isValid ? user : null;
        }
        catch (error) {
            logger_1.logger.error('Error validating user:', error);
            throw new appError_1.AppError('Error validating user', 500);
        }
    }
    static async generateAuthToken(user) {
        return jsonwebtoken_1.default.sign({ id: user._id.toString() }, config_1.config.JWT_SECRET, {
            expiresIn: Number(config_1.config.JWT_EXPIRES_IN) || '30d'
        });
    }
    static async register(userData) {
        try {
            const user = await User_1.User.create(userData);
            return user;
        }
        catch (error) {
            logger_1.logger.error('Error registering user:', error);
            throw new appError_1.AppError('Error registering user', 500);
        }
    }
    static async requestPasswordReset(email) {
        try {
            const user = await User_1.User.findOne({ email });
            if (!user) {
                throw new appError_1.AppError('No user found with that email address', 404);
            }
            const resetToken = jsonwebtoken_1.default.sign({ id: user._id }, config_1.config.JWT_SECRET, {
                expiresIn: '1h'
            });
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 heure
            await user.save();
            // TODO: Send reset password email
        }
        catch (error) {
            logger_1.logger.error('Error requesting password reset:', error);
            throw new appError_1.AppError('Error requesting password reset', 500);
        }
    }
    static async resetPassword(token, newPassword) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
            const user = await User_1.User.findOne({
                _id: decoded.id,
                resetPasswordToken: token,
                resetPasswordExpire: { $gt: Date.now() }
            });
            if (!user) {
                throw new appError_1.AppError('Invalid or expired reset token', 400);
            }
            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
        }
        catch (error) {
            logger_1.logger.error('Error resetting password:', error);
            throw new appError_1.AppError('Error resetting password', 500);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map