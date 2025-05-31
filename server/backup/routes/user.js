"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Routes publiques
// router.post('/register', [
//   body('email').isEmail().withMessage('Email invalide'),
//   body('password')
//     .isLength({ min: 6 })
//     .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
//   body('name').not().isEmpty().withMessage('Le nom est requis'),
// ], async (req: Request, res: Response) => { await userController.register(req, res); });
// router.post('/login', [
//   body('email').isEmail().withMessage('Email invalide'),
//   body('password').exists().withMessage('Le mot de passe est requis'),
// ], async (req: Request, res: Response) => { await userController.login(req, res); });
// Routes protégées
// router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.getProfile(req, res); });
// router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.updateProfile(req, res); });
// router.put('/password', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.updatePassword(req, res); });
// router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.getProfile(req, res); });
// Routes admin
// router.get('/admin/users', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.getAllUsers(req, res); });
// router.put('/admin/users/:id', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.updateUser(req, res); });
// router.delete('/admin/users/:id', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.deleteUser(req, res); });
exports.default = router;
