const Job = require('../models/Job');

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location } = req.body;
    const job = new Job({ title, description, company, location });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Offre non trouvée.' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}; 