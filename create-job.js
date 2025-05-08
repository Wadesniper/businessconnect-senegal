const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  jobType: String,
  sector: String,
  description: String,
  missions: [String],
  requirements: [String],
  contactEmail: String,
  keywords: [String],
  isActive: Boolean
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

mongoose.connect('mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority')
  .then(async () => {
    console.log('Connecté à MongoDB');
    
    const newJob = new Job({
      title: 'Commercial',
      company: 'KMI HR PARTNERS',
      location: 'Dakar',
      jobType: 'CDD - Stage',
      sector: 'BTP, construction',
      description: 'Nous recrutons des Commerciaux pour développer et gérer les relations clients dans l\'industrie des matériaux de construction ou de la restauration.',
      missions: [
        'Développer et entretenir des relations avec les clients nouveaux et existants',
        'Identifier les clients potentiels et rechercher activement des opportunités de vente',
        'Réaliser des études et analyses de marché',
        'Présenter et démontrer les produits',
        'Négocier et conclure des contrats de vente',
        'Répondre aux demandes des clients et gérer les plaintes',
        'Collaborer avec l\'équipe marketing sur des stratégies promotionnelles',
        'Préparer des rapports de ventes et projections',
        'Suivre les évolutions du marché et de la réglementation',
        'Participer à des salons professionnels',
        'Assurer la logistique liée à la livraison des marchandises',
        'Gérer les tâches administratives'
      ],
      requirements: [
        'Expérience confirmée en vente, idéalement dans les matériaux de construction ou la restauration',
        'Diplôme en administration, marketing ou domaine connexe',
        'Maîtrise de la communication, négociation et gestion de relations',
        'Sens du service client et capacité à fidéliser',
        'Motivation, autonomie et orientation résultats',
        'Maîtrise de MS Office, Google Apps et logiciels CRM',
        'Maîtrise du français et de l\'anglais à l\'écrit comme à l\'oral',
        'Permis de conduire valide et disponibilité pour voyager au Sénégal'
      ],
      contactEmail: 'km-international.infos@kmints.com',
      keywords: ['commercial', 'BTP', 'matériaux de construction', 'vente', 'CRM', 'logistique', 'anglais', 'négociation', 'relation client', 'marketing'],
      isActive: true
    });

    try {
      const savedJob = await newJob.save();
      console.log('Offre d\'emploi créée avec succès:', savedJob);
    } catch (error) {
      console.error('Erreur lors de la création de l\'offre:', error);
    }
    
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('Erreur de connexion à MongoDB:', error);
  }); 