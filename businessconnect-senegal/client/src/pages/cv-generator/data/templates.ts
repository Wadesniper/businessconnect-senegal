import { Template } from '../types';

export const CV_TEMPLATES: Template[] = [
  {
    id: 'corporate-pro',
    name: 'Corporate Pro',
    thumbnail: '/images/cv-templates/corporate-pro.jpg',
    previewImage: '/images/cv-templates/preview-corporate.jpg',
    description: 'Design moderne et professionnel, idéal pour les cadres et managers',
    category: 'Business',
    features: ['Photo professionnelle', 'Mise en page structurée', 'Sections personnalisables'],
    profileImage: '/images/cv-templates/profiles/woman-1.jpg',
    sampleData: {
      title: 'Responsable Marketing Digital',
      experience: ['Chef de projet chez Orange Sénégal', 'Marketing Manager chez Wave'],
      education: ['Master en Marketing Digital - ISM Dakar', 'DESS en Management - IAM'],
      skills: ['Marketing Digital', 'Gestion de projet', 'Analytics']
    }
  },
  {
    id: 'tech-innovator',
    name: 'Tech Innovator',
    thumbnail: '/images/cv-templates/tech-innovator.jpg',
    previewImage: '/images/cv-templates/preview-tech.jpg',
    description: 'Pour les professionnels du numérique et de la tech',
    category: 'Tech',
    features: ['Barre de compétences', 'Section projets', 'Git & Stack technique'],
    profileImage: '/images/cv-templates/profiles/man-1.jpg',
    sampleData: {
      title: 'Développeur Full Stack Senior',
      experience: ['Lead Developer chez Jumia Sénégal', 'Full Stack Dev chez PayDunya'],
      education: ['Ingénieur Informatique - ESP Dakar', 'Certification AWS'],
      skills: ['React/Node.js', 'Python', 'DevOps']
    }
  },
  {
    id: 'creative-plus',
    name: 'Creative Plus',
    thumbnail: '/images/cv-templates/creative-plus.jpg',
    previewImage: '/images/cv-templates/preview-creative.jpg',
    description: 'Design créatif pour les professionnels des industries créatives',
    category: 'Créatif',
    features: ['Portfolio visuel', 'Design unique', 'Mise en page créative'],
    profileImage: '/images/cv-templates/profiles/woman-2.jpg',
    sampleData: {
      title: 'Directrice Artistique',
      experience: ['DA chez Ogilvy Africa', 'Designer chez Publicis Sénégal'],
      education: ['Master en Design - IAM', 'Formation UX/UI Design'],
      skills: ['Direction Artistique', 'Adobe Creative Suite', 'Design Thinking']
    }
  },
  {
    id: 'executive-pro',
    name: 'Executive Pro',
    thumbnail: '/images/cv-templates/executive-pro.jpg',
    previewImage: '/images/cv-templates/preview-executive.jpg',
    description: 'Style élégant pour les postes de direction',
    category: 'Classique',
    features: ['Design raffiné', 'Structure claire', 'Accent sur le leadership'],
    profileImage: '/images/cv-templates/profiles/man-2.jpg',
    sampleData: {
      title: 'Directeur Général',
      experience: ['DG chez SONATEL', 'Directeur Commercial chez CBAO'],
      education: ['MBA - HEC Paris', 'Master en Finance - ESP'],
      skills: ['Leadership', 'Stratégie d\'entreprise', 'Gestion financière']
    }
  },
  {
    id: 'startup-edge',
    name: 'Startup Edge',
    thumbnail: '/images/cv-templates/startup-edge.jpg',
    previewImage: '/images/cv-templates/preview-startup.jpg',
    description: 'Pour les entrepreneurs et startuppers innovants',
    category: 'Business',
    features: ['Design moderne', 'Accent sur les résultats', 'Section achievements'],
    profileImage: '/images/cv-templates/profiles/woman-3.jpg',
    sampleData: {
      title: 'CEO & Co-fondateur',
      experience: ['CEO de ma startup FinTech', 'Business Developer chez Wave'],
      education: ['Master Entrepreneuriat - IAM', 'Formation Y Combinator'],
      skills: ['Leadership', 'Levée de fonds', 'Growth Hacking']
    }
  },
  {
    id: 'academic-pro',
    name: 'Academic Pro',
    thumbnail: '/images/cv-templates/academic-pro.jpg',
    previewImage: '/images/cv-templates/preview-academic.jpg',
    description: 'Parfait pour les enseignants et chercheurs',
    category: 'Éducation',
    features: ['Section publications', 'Parcours académique', 'Projets de recherche'],
    profileImage: '/images/cv-templates/profiles/woman-4.jpg',
    sampleData: {
      title: 'Professeur-Chercheur en Sciences Sociales',
      experience: ['Professeur à l\'UCAD', 'Chercheur au CODESRIA'],
      education: ['Doctorat en Sociologie - UCAD', 'DEA Sciences Sociales'],
      skills: ['Recherche', 'Publication académique', 'Enseignement']
    }
  },
  {
    id: 'medical-pro',
    name: 'Medical Pro',
    thumbnail: '/images/cv-templates/medical-pro.jpg',
    previewImage: '/images/cv-templates/preview-medical.jpg',
    description: 'Spécialement conçu pour les professionnels de santé',
    category: 'Santé',
    features: ['Certifications médicales', 'Expérience clinique', 'Publications'],
    profileImage: '/images/cv-templates/profiles/woman-5.jpg',
    sampleData: {
      title: 'Médecin Spécialiste',
      experience: ['Chef de service à l\'Hôpital Principal', 'Médecin à Fann'],
      education: ['Doctorat en Médecine - UCAD', 'Spécialisation en Cardiologie'],
      skills: ['Cardiologie', 'Recherche médicale', 'Gestion d\'équipe']
    }
  },
  {
    id: 'legal-pro',
    name: 'Legal Pro',
    thumbnail: '/images/cv-templates/legal-pro.jpg',
    previewImage: '/images/cv-templates/preview-legal.jpg',
    description: 'Pour les professionnels du droit et de la justice',
    category: 'Juridique',
    features: ['Section jurisprudence', 'Domaines de compétence', 'Affiliations'],
    profileImage: '/images/cv-templates/profiles/man-3.jpg',
    sampleData: {
      title: 'Avocat d\'Affaires',
      experience: ['Associé Cabinet juridique', 'Conseiller juridique BCEAO'],
      education: ['Master en Droit des Affaires - UCAD', 'Formation Barreau'],
      skills: ['Droit des affaires', 'Négociation', 'Conseil juridique']
    }
  },
  {
    id: 'consultant-pro',
    name: 'Consultant Pro',
    thumbnail: '/images/cv-templates/consultant-pro.jpg',
    previewImage: '/images/cv-templates/preview-consultant.jpg',
    description: 'Idéal pour les consultants et experts indépendants',
    category: 'Conseil',
    features: ['Mise en avant expertise', 'Références clients', 'Case studies'],
    profileImage: '/images/cv-templates/profiles/man-4.jpg',
    sampleData: {
      title: 'Consultant en Stratégie',
      experience: ['Senior Consultant chez Deloitte', 'Manager chez McKinsey'],
      education: ['MBA - ESSEC', 'Ingénieur Polytechnicien'],
      skills: ['Stratégie d\'entreprise', 'Change Management', 'Due Diligence']
    }
  },
  {
    id: 'ngo-impact',
    name: 'NGO Impact',
    thumbnail: '/images/cv-templates/ngo-impact.jpg',
    previewImage: '/images/cv-templates/preview-ngo.jpg',
    description: 'Pour les professionnels du développement et humanitaire',
    category: 'ONG/Humanitaire',
    features: ['Impact social', 'Gestion de projets', 'Partenariats'],
    profileImage: '/images/cv-templates/profiles/man-5.jpg',
    sampleData: {
      title: 'Coordinateur de Projets Humanitaires',
      experience: ['Chef de Mission MSF', 'Coordinateur UNICEF Sénégal'],
      education: ['Master Action Humanitaire - Geneva', 'License Sociologie'],
      skills: ['Gestion de projets', 'Coordination terrain', 'Fundraising']
    }
  }
]; 