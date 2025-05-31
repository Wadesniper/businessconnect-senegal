"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marketplaceController_1 = require("../controllers/marketplaceController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const marketplaceController = new marketplaceController_1.MarketplaceController();
// Routes publiques
router.get('/items', marketplaceController.getAllItems);
router.get('/items/search', marketplaceController.searchItems);
router.get('/items/:id', marketplaceController.getItemById);
router.get('/categories', marketplaceController.getCategories);
// Routes protégées
router.post('/items', auth_1.authenticate, marketplaceController.createItem);
router.put('/items/:id', auth_1.authenticate, marketplaceController.updateItem);
router.delete('/items/:id', auth_1.authenticate, marketplaceController.deleteItem);
// Routes admin
router.get('/admin/items', auth_1.authenticate, auth_1.isAdmin, marketplaceController.getAllItemsAdmin);
router.put('/admin/items/:id/status', auth_1.authenticate, auth_1.isAdmin, marketplaceController.updateItemStatus);
router.delete('/admin/items/:id', auth_1.authenticate, auth_1.isAdmin, marketplaceController.deleteItemAdmin);
exports.default = router;
