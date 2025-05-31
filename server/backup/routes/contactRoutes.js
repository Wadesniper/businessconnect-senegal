"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const router = express_1.default.Router();
// Route pour envoyer un email de contact
router.post('/', async (req, res) => {
    await (0, contactController_1.sendContactEmail)(req, res);
});
exports.default = router;
