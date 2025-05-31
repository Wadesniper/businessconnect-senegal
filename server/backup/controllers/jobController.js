"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const Job_1 = __importDefault(require("../models/Job"));
class JobController {
    async getAllJobs(req, res) {
        try {
            const jobs = await Job_1.default.find();
            res.json(jobs);
        }
        catch (err) {
            res.status(500).json({ error: 'Erreur lors de la récupération des offres' });
        }
    }
    async getJobById(req, res) {
        try {
            const job = await Job_1.default.findById(req.params.id);
            if (!job) {
                return res.status(404).json({ error: 'Offre non trouvée' });
            }
            const jobObj = job.toObject();
            res.json({
                ...jobObj,
                email: jobObj.contactEmail,
                phone: jobObj.contactPhone
            });
        }
        catch (err) {
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'offre' });
        }
    }
    async createJob(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const jobData = { ...req.body, createdBy: userId };
            const job = new Job_1.default(jobData);
            await job.save();
            res.status(201).json(job);
        }
        catch (err) {
            res.status(500).json({ error: 'Erreur lors de la création de l\'offre' });
        }
    }
    async updateJob(req, res) {
        var _a, _b;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const jobId = req.params.id;
            const job = await Job_1.default.findById(jobId);
            if (!job) {
                return res.status(404).json({ error: 'Offre non trouvée' });
            }
            if (job.createdBy.toString() !== userId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
                return res.status(403).json({ error: 'Non autorisé à modifier cette offre' });
            }
            const updatedJob = await Job_1.default.findByIdAndUpdate(jobId, req.body, { new: true });
            res.json(updatedJob);
        }
        catch (err) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'offre' });
        }
    }
    async deleteJob(req, res) {
        var _a, _b;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const jobId = req.params.id;
            const job = await Job_1.default.findById(jobId);
            if (!job) {
                return res.status(404).json({ error: 'Offre non trouvée' });
            }
            if (job.createdBy.toString() !== userId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
                return res.status(403).json({ error: 'Non autorisé à supprimer cette offre' });
            }
            await Job_1.default.findByIdAndDelete(jobId);
            res.json({ message: 'Offre supprimée avec succès' });
        }
        catch (err) {
            res.status(500).json({ error: 'Erreur lors de la suppression de l\'offre' });
        }
    }
    async searchJobs(req, res) {
        try {
            const { query, category, location } = req.query;
            const searchQuery = {};
            if (query) {
                searchQuery.$or = [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ];
            }
            if (category) {
                searchQuery.category = category;
            }
            if (location) {
                searchQuery.location = { $regex: location, $options: 'i' };
            }
            const jobs = await Job_1.default.find(searchQuery);
            res.json(jobs);
        }
        catch (err) {
            res.status(500).json({ error: 'Erreur lors de la recherche des offres' });
        }
    }
    async applyForJob(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const jobId = req.params.id;
            const job = await Job_1.default.findById(jobId);
            if (!job) {
                return res.status(404).json({ error: 'Offre non trouvée' });
            }
            // Vérifier si l'utilisateur a déjà postulé
            if (job.applications.some(app => app.applicant.toString() === userId)) {
                return res.status(400).json({ error: 'Vous avez déjà postulé à cette offre' });
            }
            job.applications.push({
                applicant: userId,
                status: 'pending',
                appliedAt: new Date()
            });
            await job.save();
            res.json({ message: 'Candidature envoyée avec succès' });
        }
        catch (err) {
            res.status(500).json({ error: 'Erreur lors de l\'envoi de la candidature' });
        }
    }
    async getAllJobsAdmin(req, res) {
        var _a;
        try {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }
            const jobs = await Job_1.default.find().populate('createdBy', 'firstName lastName email');
            res.json(jobs);
        }
        catch (err) {
            res.status(500).json({ error: 'Erreur lors de la récupération des offres' });
        }
    }
    async updateJobStatus(req, res) {
        var _a;
        try {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }
            const { status } = req.body;
            const jobId = req.params.id;
            const job = await Job_1.default.findByIdAndUpdate(jobId, { status }, { new: true });
            if (!job) {
                return res.status(404).json({ error: 'Offre non trouvée' });
            }
            res.json(job);
        }
        catch (err) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
        }
    }
}
exports.JobController = JobController;
