"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const jobController = new jobController_1.JobController();
// Routes publiques
router.get('/', jobController.getAllJobs);
router.get('/search', jobController.searchJobs);
router.get('/:id', jobController.getJobById);
// Routes protégées
router.post('/', auth_1.authenticate, jobController.createJob);
router.put('/:id', auth_1.authenticate, jobController.updateJob);
router.delete('/:id', auth_1.authenticate, jobController.deleteJob);
router.post('/:id/apply', auth_1.authenticate, jobController.applyForJob);
// Routes admin
router.get('/admin/all', auth_1.authenticate, auth_1.isAdmin, jobController.getAllJobsAdmin);
router.put('/admin/:id/status', auth_1.authenticate, auth_1.isAdmin, jobController.updateJobStatus);
exports.default = router;
