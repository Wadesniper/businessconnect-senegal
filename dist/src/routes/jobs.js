"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = require("../controllers/jobController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', jobController_1.jobController.getAllJobs);
router.get('/:id', jobController_1.jobController.getJobById);
router.use(authMiddleware_1.authMiddleware);
router.post('/', jobController_1.jobController.createJob);
router.put('/:id', jobController_1.jobController.updateJob);
router.delete('/:id', jobController_1.jobController.deleteJob);
exports.default = router;
//# sourceMappingURL=jobs.js.map