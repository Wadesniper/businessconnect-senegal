"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = "mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority";
const JobSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    company: { type: String },
    location: { type: String },
    jobType: { type: String },
    sector: { type: String },
    description: { type: String },
    missions: [{ type: String }],
    requirements: [{ type: String }],
    contactEmail: { type: String },
    contactPhone: { type: String },
    keywords: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Job = mongoose_1.default.model('Job', JobSchema);
function isPhoneNumber(value) {
    // Simple regex pour détecter un numéro de téléphone (commence par + ou 7/6/3, chiffres, espaces)
    return /^([+]?\d{1,3}[\s-]?)?(\d{2,3}[\s-]?){3,}$/.test(value.trim());
}
async function migrateContacts() {
    await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
    const jobs = await Job.find({});
    let modified = 0;
    for (const job of jobs) {
        if (job.contactEmail && isPhoneNumber(job.contactEmail)) {
            // Si contactPhone est déjà rempli, on ne touche pas
            if (!job.contactPhone) {
                job.contactPhone = job.contactEmail;
                job.contactEmail = '';
                await job.save();
                modified++;
                console.log(`Modifié : ${job.title} (${job._id})`);
            }
        }
    }
    await mongoose_1.default.disconnect();
    console.log(`Migration terminée. ${modified} documents modifiés.`);
}
migrateContacts().catch(console.error);
