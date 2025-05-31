"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority';
async function resetAdminPassword() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        const admin = await User_1.User.findOne({ role: 'admin', phone: '786049485' });
        if (!admin) {
            console.log('Aucun utilisateur admin avec ce téléphone trouvé.');
        }
        else {
            const hashedPassword = await bcryptjs_1.default.hash('Admin@2025!', 10);
            admin.password = hashedPassword;
            await admin.save();
            console.log('Mot de passe admin réinitialisé avec succès.');
            console.log(`- Téléphone : ${admin.phone} | Email : ${admin.email} | Nom : ${admin.firstName} ${admin.lastName} | ID : ${admin._id}`);
        }
        await mongoose_1.default.disconnect();
    }
    catch (err) {
        console.error('Erreur lors de la réinitialisation du mot de passe admin :', err);
        process.exit(1);
    }
}
resetAdminPassword();
