"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllJobs = void 0;
const Job_1 = require("../models/Job");
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job_1.Job.find();
        res.json(jobs);
    }
    catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des offres' });
    }
};
exports.getAllJobs = getAllJobs;
//# sourceMappingURL=jobController.js.map