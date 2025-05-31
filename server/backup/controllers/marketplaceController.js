"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceController = void 0;
const marketplace_1 = require("../models/marketplace");
class MarketplaceController {
    async getAllItems(req, res) {
        try {
            const items = await marketplace_1.MarketplaceItem.find({ status: 'approved' });
            res.json(items);
        }
        catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
        }
    }
    async getItemById(req, res) {
        try {
            const item = await marketplace_1.MarketplaceItem.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ error: 'Article non trouvé' });
            }
            res.json(item);
        }
        catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
        }
    }
    async searchItems(req, res) {
        try {
            const { query, category } = req.query;
            const searchQuery = { status: 'approved' };
            if (query) {
                searchQuery.$or = [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ];
            }
            if (category) {
                searchQuery.category = category;
            }
            const items = await marketplace_1.MarketplaceItem.find(searchQuery);
            res.json(items);
        }
        catch (error) {
            res.status(500).json({ error: 'Erreur lors de la recherche d\'articles' });
        }
    }
    async getCategories(req, res) {
        try {
            const categories = await marketplace_1.MarketplaceItem.distinct('category');
            res.json(categories);
        }
        catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
        }
    }
    async createItem(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const item = new marketplace_1.MarketplaceItem({
                ...req.body,
                seller: userId,
                status: 'pending'
            });
            await item.save();
            res.status(201).json(item);
        }
        catch (error) {
            res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
        }
    }
    async updateItem(req, res) {
        var _a, _b;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const itemId = req.params.id;
            const item = await marketplace_1.MarketplaceItem.findById(itemId);
            if (!item) {
                return res.status(404).json({ error: 'Article non trouvé' });
            }
            if (item.seller !== userId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
                return res.status(403).json({ error: 'Non autorisé à modifier cet article' });
            }
            const updatedItem = await marketplace_1.MarketplaceItem.findByIdAndUpdate(itemId, { ...req.body, status: 'pending' }, { new: true });
            res.json(updatedItem);
        }
        catch (error) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'article' });
        }
    }
    async deleteItem(req, res) {
        var _a, _b;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const itemId = req.params.id;
            const item = await marketplace_1.MarketplaceItem.findById(itemId);
            if (!item) {
                return res.status(404).json({ error: 'Article non trouvé' });
            }
            if (item.seller !== userId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
                return res.status(403).json({ error: 'Non autorisé à supprimer cet article' });
            }
            await marketplace_1.MarketplaceItem.findByIdAndDelete(itemId);
            res.json({ message: 'Article supprimé avec succès' });
        }
        catch (error) {
            res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
        }
    }
    // Routes admin
    async getAllItemsAdmin(req, res) {
        var _a;
        try {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }
            const items = await marketplace_1.MarketplaceItem.find().populate('seller', 'firstName lastName email');
            res.json(items);
        }
        catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
        }
    }
    async updateItemStatus(req, res) {
        var _a;
        try {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }
            const { status } = req.body;
            const itemId = req.params.id;
            const item = await marketplace_1.MarketplaceItem.findByIdAndUpdate(itemId, { status }, { new: true });
            if (!item) {
                return res.status(404).json({ error: 'Article non trouvé' });
            }
            res.json(item);
        }
        catch (error) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
        }
    }
    async deleteItemAdmin(req, res) {
        var _a;
        try {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }
            const itemId = req.params.id;
            const item = await marketplace_1.MarketplaceItem.findByIdAndDelete(itemId);
            if (!item) {
                return res.status(404).json({ error: 'Article non trouvé' });
            }
            res.json({ message: 'Article supprimé avec succès' });
        }
        catch (error) {
            res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
        }
    }
}
exports.MarketplaceController = MarketplaceController;
