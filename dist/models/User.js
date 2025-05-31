"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
// Schéma Mongoose avec validation
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true,
        minlength: [2, 'Le prénom doit contenir au moins 2 caractères']
    },
    lastName: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true,
        minlength: [2, 'Le nom doit contenir au moins 2 caractères']
    },
    email: {
        type: String,
        sparse: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                // Si l'email n'est pas fourni, c'est valide
                if (!v)
                    return true;
                // Sinon on vérifie le format
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Veuillez fournir un email valide'
        },
        // Ne pas inclure le champ si la valeur est null ou undefined
        set: function (v) {
            if (!v)
                return undefined;
            return v.toLowerCase().trim();
        }
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
        select: false
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'etudiant', 'annonceur', 'recruteur'],
            message: 'Le rôle doit être soit "admin", "etudiant", "annonceur" ou "recruteur"'
        },
        default: 'etudiant'
    },
    phoneNumber: {
        type: String,
        required: [true, 'Le numéro de téléphone est requis'],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                // Nettoie le numéro en gardant uniquement les chiffres et le +
                let cleaned = v.replace(/[^0-9+]/g, '');
                // Si le numéro commence par +, c'est déjà au format international
                if (cleaned.startsWith('+')) {
                    // Vérifie que le numéro a une longueur valide (indicatif + 8 chiffres minimum)
                    if (cleaned.length >= 10)
                        return true;
                    return false;
                }
                // Si le numéro commence par 77, 78, ou 76 (numéros sénégalais)
                if (/^(77|78|76|70)\d{7}$/.test(cleaned)) {
                    return true;
                }
                return false;
            },
            message: 'Le numéro de téléphone doit commencer par 70, 76, 77 ou 78 pour les numéros sénégalais'
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    preferences: {
        type: {
            notifications: { type: Boolean, default: true },
            newsletter: { type: Boolean, default: true },
            language: { type: String, default: 'fr' }
        },
        default: {}
    },
    notifications: [{
            message: { type: String, required: true },
            read: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now }
        }]
});
// Supprime l'index email existant
userSchema.collection.dropIndex('email_1')
    .catch(err => console.log('Index email_1 n\'existe pas encore'));
// Recrée l'index avec les bonnes options
userSchema.index({ email: 1 }, { unique: true, sparse: true, background: true });
userSchema.index({ phoneNumber: 1 }, { unique: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=User.js.map