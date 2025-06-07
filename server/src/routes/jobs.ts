import { Router } from 'express';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express.js';
import { jobController, getCategories as getJobCategories } from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';
// import { JobApplication, JobCategory, JobStatus, JobType } from '../models/Job'; // Supprimé car incorrect

const router = Router();

// Routes publiques
// router.get('/jobs', (req, res) => jobController.getAllJobs(req, res));
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  jobController.getJobById(req, res).catch(next); 
});
// router.get('/categories', (req, res) => jobController.getCategories(req, res));
// router.get('/search', (req, res) => jobController.searchJobs(req, res));

// Routes protégées
// router.use(authMiddleware);
// router.post('/jobs', (req, res) => jobController.createJob(req, res));
// router.put('/jobs/:id', (req, res) => jobController.updateJob(req, res));
// router.delete('/jobs/:id', (req, res) => jobController.deleteJob(req, res));
// router.post('/jobs/:id/apply', (req, res) => jobController.applyToJob(req, res));

// Routes recruteur
// router.get('/employer/jobs', (req, res) => jobController.getEmployerJobs(req, res));
// router.get('/employer/applications', (req, res) => jobController.getJobApplications(req, res));
// router.put('/employer/applications/:id', (req, res) => jobController.updateApplicationStatus(req, res));

// Routes candidat
// router.get('/applications', (req, res) => jobController.getCandidateApplications(req, res));
// router.get('/saved-jobs', (req, res) => jobController.getSavedJobs(req, res));
// router.post('/jobs/:id/save', (req, res) => jobController.toggleSaveJob(req, res));

// Route publique pour récupérer toutes les offres d'emploi
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  jobController.getAllJobs(req, res).catch(next);
});

// Route pour récupérer les catégories (si getJobCategories est utilisé)
router.get('/meta/categories', (req: Request, res: Response, next: NextFunction) => {
    getJobCategories(req,res).catch(next);
});

// Route pour la recherche (à décommenter et adapter si nécessaire)
router.get('/search/all', (req: Request, res: Response, next: NextFunction) => { 
  jobController.searchJobs(req, res).catch(next);
});

// Routes protégées
// Ces routes nécessitent que l'utilisateur soit authentifié.
// Le middleware 'authenticate' s'en charge et ajoute 'req.user'.

router.post('/', authenticate, (req: Request, res: Response, next: NextFunction) => {
  jobController.createJob(req as AuthRequest, res).catch(next);
});

router.put('/:id', authenticate, (req: Request, res: Response, next: NextFunction) => {
  jobController.updateJob(req as AuthRequest, res).catch(next);
});

router.delete('/:id', authenticate, (req: Request, res: Response, next: NextFunction) => {
  jobController.deleteJob(req as AuthRequest, res).catch(next);
});

router.post('/:id/apply', authenticate, (req: Request, res: Response, next: NextFunction) => {
  jobController.applyForJob(req as AuthRequest, res).catch(next);
});

// Exemple pour récupérer les candidatures de l'utilisateur connecté
router.get('/my/applications', authenticate, (req: Request, res: Response, next: NextFunction) => {
    jobController.getMyApplications(req as AuthRequest, res).catch(next);
});

// Exemple pour récupérer les candidatures pour une offre spécifique (pour l'employeur)
router.get('/:id/applications', authenticate, (req: Request, res: Response, next: NextFunction) => {
    jobController.getJobApplications(req as AuthRequest, res).catch(next);
});

// Exemple pour mettre à jour le statut d'une candidature (pour l'employeur)
router.put('/:id/applications/:applicationId', authenticate, (req: Request, res: Response, next: NextFunction) => {
    jobController.updateApplicationStatus(req as AuthRequest, res).catch(next);
});

// Les autres routes (protégées) peuvent être ajoutées ici si besoin
// router.use(authMiddleware);
// router.post('/', ...);
// etc.

export default router; 