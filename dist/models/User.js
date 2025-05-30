"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserValidationSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
// Schéma de validation Zod
exports.UserValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: zod_1.z.string().email('Email invalide').optional(),
    password: zod_1.z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    role: zod_1.z.enum(['user', 'admin']).default('user'),
    phone: zod_1.z.string()
        .refine((value) => {
        // Nettoie le numéro en gardant uniquement les chiffres, les espaces et le +
        const cleaned = value.replace(/[^0-9\s+]/g, '');
        // Retire les espaces pour la validation
        const withoutSpaces = cleaned.replace(/\s/g, '');
        // Vérifie le format international
        if (withoutSpaces.startsWith('+')) {
            return withoutSpaces.length >= 10;
        }
        // Vérifie le format sénégalais
        return /^7\d{8}$/.test(withoutSpaces);
    }, 'Le numéro doit être au format international (+XXX...) ou sénégalais (7XXXXXXXX)'),
    isVerified: zod_1.z.boolean().default(false),
    resetPasswordToken: zod_1.z.string().optional(),
    resetPasswordExpire: zod_1.z.date().optional(),
    createdAt: zod_1.z.date().default(() => new Date()),
});
// Schéma Mongoose avec validation
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, minlength: 2 },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                // Nettoie le numéro en gardant uniquement les chiffres, les espaces et le +
                const cleaned = value.replace(/[^0-9\s+]/g, '');
                // Retire les espaces pour la validation
                const withoutSpaces = cleaned.replace(/\s/g, '');
                // Vérifie le format international
                if (withoutSpaces.startsWith('+')) {
                    return withoutSpaces.length >= 10;
                }
                // Vérifie le format sénégalais
                return /^7\d{8}$/.test(withoutSpaces);
            },
            message: 'Le numéro doit être au format international (+XXX...) ou sénégalais (7XXXXXXXX)'
        }
    },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: { type: Date, default: Date.now }
});
// Index pour améliorer les performances des requêtes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
exports.User = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=User.js.map