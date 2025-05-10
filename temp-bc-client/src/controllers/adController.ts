import { Request, Response } from 'express';
import { Ad } from '../models/ad';

export const adController = {
  async getAllAds(req: Request, res: Response) {
    try {
      const ads = await Ad.find().sort({ createdAt: -1 });
      res.json(ads);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des annonces' });
    }
  },

  async getAdById(req: Request, res: Response) {
    try {
      const ad = await Ad.findById(req.params.id);
      if (!ad) {
        return res.status(404).json({ message: 'Annonce non trouvée' });
      }
      res.json(ad);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'annonce' });
    }
  },

  async createAd(req: Request, res: Response) {
    try {
      const ad = new Ad({
        ...req.body,
        userId: req.user?.id
      });
      await ad.save();
      res.status(201).json(ad);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'annonce' });
    }
  },

  async updateAd(req: Request, res: Response) {
    try {
      const ad = await Ad.findOneAndUpdate(
        { _id: req.params.id, userId: req.user?.id },
        req.body,
        { new: true }
      );
      if (!ad) {
        return res.status(404).json({ message: 'Annonce non trouvée ou non autorisée' });
      }
      res.json(ad);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'annonce' });
    }
  },

  async deleteAd(req: Request, res: Response) {
    try {
      const ad = await Ad.findOneAndDelete({
        _id: req.params.id,
        userId: req.user?.id
      });
      if (!ad) {
        return res.status(404).json({ message: 'Annonce non trouvée ou non autorisée' });
      }
      res.json({ message: 'Annonce supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'annonce' });
    }
  }
}; 