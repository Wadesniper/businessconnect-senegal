"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        sparse: true,
        unique: true,
        validate: {
            validator: function (v) {
                return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Format d\'email invalide'
        }
    },
    phone: {
        type: String,
        sparse: true,
        unique: true,
        validate: {
            validator: function (v) {
                return !v || /^\+?[0-9]{8,15}$/.test(v);
            },
            message: 'Format de numéro de téléphone invalide'
        }
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'employeur'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    preferences: {
        emailNotifications: { type: Boolean, default: true },
        language: { type: String, default: 'fr' },
        theme: { type: String, default: 'light' }
    },
    notifications: [notificationSchema],
    status: {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        default: 'active'
    }
}, { timestamps: true });
// Méthode pour masquer les champs sensibles
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.verificationToken;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpires;
    return obj;
};
// Validation personnalisée : au moins un moyen de contact (email ou téléphone)
userSchema.pre('save', function (next) {
    if (!this.email && !this.phone) {
        next(new Error('Au moins un moyen de contact (email ou téléphone) est requis'));
    }
    else {
        next();
    }
});
exports.User = (0, mongoose_1.model)('User', userSchema);
