"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webhookController_1 = require("../controllers/webhookController");
const router = express_1.default.Router();
const webhookController = new webhookController_1.WebhookController();
router.post('/payment', webhookController.handlePaymentWebhook);
exports.default = router;
