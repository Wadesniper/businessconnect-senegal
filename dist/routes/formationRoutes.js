"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const formationController_1 = require("../controllers/formationController");
const auth_1 = require("../middleware/auth");
const restrictTo_1 = require("../middleware/restrictTo");
const router = express_1.default.Router();
const formationController = new formationController_1.FormationController();
router.get('/', formationController.getAllFormations);
router.get('/:id', formationController.getFormation);
router.get('/category/:category', formationController.getFormationsByCategory);
router.use(auth_1.protect);
router.get('/:id/access', formationController.accessFormation);
router.use((0, restrictTo_1.restrictTo)('admin'));
router.post('/', formationController.addFormation);
exports.default = router;
//# sourceMappingURL=formationRoutes.js.map