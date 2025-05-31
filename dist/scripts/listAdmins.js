"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const db_1 = require("../config/db");
const logger_1 = require("../utils/logger");
async function listAdmins() {
    try {
        await (0, db_1.connectDB)();
        const admins = await User_1.User.find({ role: 'admin' });
        if (admins.length === 0) {
            console.log('Aucun administrateur trouvé dans la base de données.');
            process.exit(0);
        }
        console.log(`\nListe des administrateurs (${admins.length}):\n`);
        admins.forEach(admin => {
            console.log(`- Téléphone : ${admin.phoneNumber} | Email : ${admin.email} | Nom : ${admin.firstName} ${admin.lastName} | ID : ${admin._id}`);
        });
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de la récupération des administrateurs:', error);
        process.exit(1);
    }
}
listAdmins();
//# sourceMappingURL=listAdmins.js.map