"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adController = void 0;
const ad_1 = require("../models/ad");
exports.adController = {
    async getAllAds(req, res) {
        try {
            const ads = await ad_1.Ad.find().sort({ createdAt: -1 });
            res.json(ads);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des annonces' });
        }
    },
    async getAdById(req, res) {
        try {
            const ad = await ad_1.Ad.findById(req.params.id);
            if (!ad) {
                return res.status(404).json({ message: 'Annonce non trouvée' });
            }
            res.json(ad);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération de l\'annonce' });
        }
    },
    async createAd(req, res) {
        var _a;
        try {
            const ad = new ad_1.Ad({
                ...req.body,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            });
            await ad.save();
            res.status(201).json(ad);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la création de l\'annonce' });
        }
    },
    async updateAd(req, res) {
        var _a;
        try {
            const ad = await ad_1.Ad.findOneAndUpdate({ _id: req.params.id, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, req.body, { new: true });
            if (!ad) {
                return res.status(404).json({ message: 'Annonce non trouvée ou non autorisée' });
            }
            res.json(ad);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'annonce' });
        }
    },
    async deleteAd(req, res) {
        var _a;
        try {
            const ad = await ad_1.Ad.findOneAndDelete({
                _id: req.params.id,
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
            });
            if (!ad) {
                return res.status(404).json({ message: 'Annonce non trouvée ou non autorisée' });
            }
            res.json({ message: 'Annonce supprimée avec succès' });
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression de l\'annonce' });
        }
    }
};
//# sourceMappingURL=adController.js.map