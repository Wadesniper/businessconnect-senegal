"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { paymentController } from '../controllers/paymentController';
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Routes protégées par authentification
router.use(auth_1.authenticate);
// Routes de configuration
router.post('/setup-intent', (req, res) => {
    // paymentController.createSetupIntent(req, res);
});
router.get('/payment-methods', (req, res) => {
    // paymentController.getPaymentMethods(req, res);
});
router.delete('/payment-methods/:id', (req, res) => {
    // paymentController.deletePaymentMethod(req, res);
});
// Routes de paiement
router.post('/pay', (req, res) => {
    // paymentController.processPayment(req, res);
});
router.post('/subscription', (req, res) => {
    // paymentController.createSubscription(req, res);
});
router.put('/subscription/cancel', (req, res) => {
    // paymentController.cancelSubscription(req, res);
});
// Routes de remboursement (admin uniquement)
router.post('/refund/:paymentId', auth_1.isAdmin, (req, res) => {
    // paymentController.refundPayment(req, res);
});
// Webhooks
router.post('/webhook', (req, res) => {
    // paymentController.handleWebhook(req, res);
});
// Routes de factures
router.get('/invoices', (req, res) => {
    // paymentController.getInvoices(req, res);
});
router.get('/invoices/:id', (req, res) => {
    // paymentController.getInvoice(req, res);
});
router.get('/invoices/:id/download', (req, res) => {
    // paymentController.downloadInvoice(req, res);
});
// Routes protégées par authentification admin
router.use(auth_1.isAdmin);
exports.default = router;
