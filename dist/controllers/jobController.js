"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobController = void 0;
const job_1 = require("../models/job");
exports.jobController = {
    async getAllJobs(req, res) {
        try {
            const jobs = await job_1.Job.find().sort({ createdAt: -1 });
            res.json(jobs);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des offres d\'emploi' });
        }
    },
    async getJobById(req, res) {
        try {
            const job = await job_1.Job.findById(req.params.id);
            if (!job) {
                return res.status(404).json({ message: 'Offre d\'emploi non trouvée' });
            }
            res.json(job);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération de l\'offre d\'emploi' });
        }
    },
    async createJob(req, res) {
        var _a;
        try {
            const job = new job_1.Job({
                ...req.body,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            });
            await job.save();
            res.status(201).json(job);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la création de l\'offre d\'emploi' });
        }
    },
    async updateJob(req, res) {
        var _a;
        try {
            const job = await job_1.Job.findOneAndUpdate({ _id: req.params.id, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, req.body, { new: true });
            if (!job) {
                return res.status(404).json({ message: 'Offre d\'emploi non trouvée ou non autorisée' });
            }
            res.json(job);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'offre d\'emploi' });
        }
    },
    async deleteJob(req, res) {
        var _a;
        try {
            const job = await job_1.Job.findOneAndDelete({
                _id: req.params.id,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            });
            if (!job) {
                return res.status(404).json({ message: 'Offre d\'emploi non trouvée ou non autorisée' });
            }
            res.json({ message: 'Offre d\'emploi supprimée avec succès' });
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression de l\'offre d\'emploi' });
        }
    }
};
//# sourceMappingURL=jobController.js.map