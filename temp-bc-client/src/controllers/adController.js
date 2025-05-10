const Ad = require('../models/Ad');

exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 }).populate('user', 'email name');
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.createAd = async (req, res) => {
  try {
    const { title, description, price, image, user } = req.body;
    const ad = new Ad({ title, description, price, image, user });
    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('user', 'email name');
    if (!ad) return res.status(404).json({ message: 'Annonce non trouvée.' });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}; 