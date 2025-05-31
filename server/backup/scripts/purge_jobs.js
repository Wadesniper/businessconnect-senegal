"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = "mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority";
const JobSchema = new mongoose_1.default.Schema({}, { strict: false });
const Job = mongoose_1.default.model('Job', JobSchema);
async function purgeJobs() {
    try {
        await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
        console.log('Connecté à MongoDB');
        const result = await Job.deleteMany({});
        console.log(`Offres supprimées : ${result.deletedCount}`);
        await mongoose_1.default.disconnect();
        console.log('Déconnexion MongoDB');
    }
    catch (err) {
        console.error('Erreur lors de la purge :', err);
        process.exit(1);
    }
}
purgeJobs();
