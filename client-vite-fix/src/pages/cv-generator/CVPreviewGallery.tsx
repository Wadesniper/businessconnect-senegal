import React from 'react';
import { useParams } from 'react-router-dom';
import { CV_TEMPLATES } from './components/data/templates';
import { Card, Typography, Alert } from 'antd';
import CVPreview from './components/CVPreview';
import { defaultCustomization } from './context/CVContext';

const { Title } = Typography;

const DEMO_PROFILES: Record<string, any> = {
  finance: {
    personalInfo: {
      firstName: 'Mamadou',
      lastName: 'Ndiaye',
      title: 'Directeur Administratif et Financier',
      email: 'mamadou.ndiaye@email.com',
      phone: '+221 77 123 45 67',
      photo: '/images/avatars/man-1.png',
      profileImage: '/images/avatars/man-1.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/mamadoundiaye',
      portfolio: 'mamadoufinance.com',
      summary: "Directeur financier avec 10+ ans d'expérience, expert en gestion de portefeuille, analyse financière, audit, reporting et management d'équipe. Forte capacité à piloter la croissance et optimiser la rentabilité."
    },
    summary: "Directeur financier sénior, expert en gestion de portefeuille, audit, reporting et management d'équipe.",
    experience: [
      {
        company: 'Société Générale Sénégal',
        title: 'Directeur Administratif et Financier',
        years: '2021-2024',
        description: "Supervision de l'ensemble des opérations financières, pilotage de la stratégie budgétaire, management d'une équipe de 12 personnes.",
        achievements: ["Mise en place d'un ERP financier", "Réduction des coûts de 15%", "Optimisation du cash-flow"],
        startDate: '2021',
        endDate: '2024',
        current: true,
      },
      {
        company: 'BNP Paribas',
        title: 'Responsable Audit Interne',
        years: '2018-2021',
        description: 'Audit des processus, contrôle interne, recommandations stratégiques auprès de la direction.',
        achievements: ['Certification ISO 9001', 'Automatisation des contrôles'],
        startDate: '2018',
        endDate: '2021',
        current: false,
      },
      {
        company: 'EY Dakar',
        title: 'Consultant Senior',
        years: '2015-2018',
        description: 'Conseil en gestion, analyse de risques, accompagnement de clients grands comptes.',
        achievements: ['Gestion de 10 missions simultanées', 'Formation de 5 juniors'],
        startDate: '2015',
        endDate: '2018',
        current: false,
      },
      {
        company: 'Cabinet Diop',
        title: 'Assistant Comptable',
        years: '2012-2015',
        description: 'Tenue de la comptabilité, préparation des bilans, gestion de la paie.',
        achievements: ['Digitalisation des archives', 'Réduction des délais de clôture'],
        startDate: '2012',
        endDate: '2015',
        current: false,
      }
    ],
    education: [
      {
        degree: 'MBA Finance',
        field: 'Finance',
        institution: 'HEC Paris',
        startDate: '2019',
        endDate: '2021',
        description: "Spécialisation en stratégie financière internationale, gestion d'actifs, fusions-acquisitions."
      },
      {
        degree: 'Master Finance',
        field: 'Finance',
        institution: 'UCAD',
        startDate: '2016',
        endDate: '2018',
        description: 'Gestion de portefeuille, analyse financière, audit.'
      },
      {
        degree: 'Licence Économie',
        field: 'Économie',
        institution: 'UCAD',
        startDate: '2013',
        endDate: '2016',
        description: 'Bases solides en économie, gestion et statistiques.'
      }
    ],
    skills: [
      { name: 'Gestion', level: 'Expert' },
      { name: 'Analyse financière', level: 'Expert' },
      { name: 'Audit', level: 'Avancé' },
      { name: 'Reporting', level: 'Avancé' },
      { name: 'Excel', level: 'Expert' },
      { name: 'Leadership', level: 'Avancé' },
      { name: 'Anglais', level: 'Avancé' },
      { name: 'Gestion de projet', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Courant' },
      { name: 'Espagnol', level: 'Intermédiaire' }
    ],
    certifications: [
      { name: 'Certification Finance', issuer: 'UCAD', date: '2021' },
      { name: 'Excel Avancé', issuer: 'Microsoft', date: '2020' },
      { name: 'CFA Level 1', issuer: 'CFA Institute', date: '2019' }
    ],
  },
  marketing: {
    personalInfo: {
      firstName: 'Fatou',
      lastName: 'Ba',
      title: 'Directrice Marketing Digital',
      email: 'fatou.ba@email.com',
      phone: '+221 77 234 56 78',
      photo: '/images/avatars/woman-1.png',
      profileImage: '/images/avatars/woman-1.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/fatouba',
      portfolio: 'fatoucom.com',
      summary: "Directrice marketing digital avec 10 ans d'expérience, experte en stratégie de marque, communication 360°, gestion d'équipe et campagnes internationales. Forte capacité à générer de la croissance et à piloter l'innovation."
    },
    summary: "Directrice marketing digital, experte en stratégie de marque, communication 360°, gestion d'équipe et campagnes internationales.",
    experience: [
      {
        company: 'Orange Sénégal',
        title: 'Directrice Marketing Digital',
        years: '2021-2024',
        description: "Pilotage de la stratégie digitale, management d'une équipe de 15 personnes, lancement de campagnes nationales et internationales.",
        achievements: ["+50% de leads qualifiés", "Lancement de 3 nouveaux produits", "Prix innovation digitale 2023"],
        startDate: '2021',
        endDate: '2024',
        current: true,
      },
      {
        company: 'Publicis Dakar',
        title: 'Responsable Communication',
        years: '2018-2021',
        description: 'Gestion de la communication corporate, coordination de projets, animation de la marque employeur.',
        achievements: ['Campagne "Talents du Sénégal"', 'Augmentation de la notoriété de 30%'],
        startDate: '2018',
        endDate: '2021',
        current: false,
      },
      {
        company: 'Sunu Assurances',
        title: 'Chef de Projet Digital',
        years: '2015-2018',
        description: 'Conception et déploiement de la stratégie digitale, gestion des réseaux sociaux, reporting.',
        achievements: ['+100K abonnés sur Facebook', 'Automatisation du reporting'],
        startDate: '2015',
        endDate: '2018',
        current: false,
      },
      {
        company: 'Agence Baobab',
        title: 'Community Manager',
        years: '2012-2015',
        description: 'Animation de communautés, création de contenus, veille concurrentielle.',
        achievements: ["Engagement x2 sur Instagram", "Création d'une charte éditoriale"],
        startDate: '2012',
        endDate: '2015',
        current: false,
      }
    ],
    education: [
      {
        degree: 'MBA Marketing Digital',
        field: 'Marketing',
        institution: 'ESG Paris',
        startDate: '2019',
        endDate: '2021',
        description: 'Stratégie digitale, brand content, data marketing.'
      },
      {
        degree: 'Master Communication',
        field: 'Communication',
        institution: 'ISM Dakar',
        startDate: '2016',
        endDate: '2018',
        description: 'Communication 360°, relations presse, événementiel.'
      },
      {
        degree: 'Licence Marketing',
        field: 'Marketing',
        institution: 'ISM Dakar',
        startDate: '2013',
        endDate: '2016',
        description: 'Bases solides en marketing, communication et stratégie.'
      }
    ],
    skills: [
      { name: 'Stratégie digitale', level: 'Expert' },
      { name: 'Brand content', level: 'Avancé' },
      { name: 'Gestion de projet', level: 'Expert' },
      { name: 'Réseaux sociaux', level: 'Expert' },
      { name: 'Créativité', level: 'Avancé' },
      { name: 'SEO/SEA', level: 'Avancé' },
      { name: 'Leadership', level: 'Avancé' },
      { name: 'Data marketing', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Courant' },
      { name: 'Espagnol', level: 'Débutant' }
    ],
    certifications: [
      { name: 'Google Analytics', issuer: 'Google', date: '2021' },
      { name: 'Certification Marketing Digital', issuer: 'ISM Dakar', date: '2019' },
      { name: 'Hubspot Inbound', issuer: 'Hubspot', date: '2020' }
    ],
  },
  health: {
    personalInfo: {
      firstName: 'Awa',
      lastName: 'Diop',
      title: 'Infirmière Coordinatrice',
      email: 'awa.diop@email.com',
      phone: '+221 77 345 67 89',
      photo: '/images/avatars/woman-2.png',
      profileImage: '/images/avatars/woman-2.png',
      address: 'Thiès, Sénégal',
      linkedin: 'linkedin.com/in/awadiop',
      summary: "Infirmière coordinatrice avec 8 ans d'expérience en milieu hospitalier, experte en gestion des urgences, soins intensifs, formation et accompagnement des patients. Forte capacité à travailler en équipe pluridisciplinaire et à gérer des situations complexes.",
      reference: 'Dr. Fatou Sarr, Médecin Chef, Hôpital Principal, fatou.sarr@email.com',
    },
    summary: "Infirmière coordinatrice, experte en gestion des urgences, soins intensifs et formation.",
    experience: [
      {
        company: 'Hôpital Principal',
        title: 'Infirmière Coordinatrice',
        years: '2021-2024',
        description: "Coordination des équipes de soins, gestion des situations d'urgence, formation continue du personnel infirmier.",
        achievements: ["Mise en place d'un protocole d'urgence", "Formation de 20 stagiaires", "Réduction du temps d'attente de 30%"],
        startDate: '2021',
        endDate: '2024',
        current: true,
      },
      {
        company: 'Clinique Pasteur',
        title: 'Infirmière Référente',
        years: '2018-2021',
        description: 'Soins intensifs, accompagnement des familles, gestion des stocks médicaux.',
        achievements: ['Création d\'un guide de bonnes pratiques', 'Gestion de 3 services simultanés'],
        startDate: '2018',
        endDate: '2021',
        current: false,
      },
      {
        company: 'Centre de Santé Thiès',
        title: 'Infirmière',
        years: '2015-2018',
        description: 'Soins courants, vaccination, suivi des patients chroniques.',
        achievements: ['Campagne de vaccination réussie', 'Suivi de 200 patients'],
        startDate: '2015',
        endDate: '2018',
        current: false,
      }
    ],
    education: [
      {
        degree: "Diplôme d'État Infirmière",
        field: 'Santé',
        institution: 'ENSP Dakar',
        startDate: '2012',
        endDate: '2015',
        description: "Formation en soins infirmiers, gestion des situations d'urgence, accompagnement des patients."
      },
      {
        degree: 'Certificat Soins Intensifs',
        field: 'Santé',
        institution: 'Université de Thiès',
        startDate: '2016',
        endDate: '2017',
        description: 'Spécialisation en soins intensifs et gestion des urgences.'
      }
    ],
    skills: [
      { name: 'Soins', level: 'Expert' },
      { name: 'Gestion des urgences', level: 'Avancé' },
      { name: 'Formation', level: 'Avancé' },
      { name: 'Empathie', level: 'Avancé' },
      { name: 'Organisation', level: 'Avancé' },
      { name: 'Gestion du stress', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Intermédiaire' }
    ],
    certifications: [
      { name: "Diplôme d'État Infirmière", issuer: 'ENSP Dakar', date: '2015' },
      { name: 'Certificat Soins Intensifs', issuer: 'Université de Thiès', date: '2017' }
    ],
  },
  education: {
    personalInfo: {
      firstName: 'Abdoulaye',
      lastName: 'Sarr',
      title: 'Professeur Agrégé de Mathématiques',
      email: 'abdoulaye.sarr@email.com',
      phone: '+221 77 456 78 90',
      photo: '/images/avatars/man-2.png',
      profileImage: '/images/avatars/man-2.png',
      address: 'Saint-Louis, Sénégal',
      linkedin: 'linkedin.com/in/abdsarr',
      summary: "Professeur agrégé passionné par la pédagogie, l'innovation et la réussite des élèves."
    },
    summary: "Professeur agrégé, expert en pédagogie, innovation et accompagnement des élèves.",
    experience: [
      {
        company: 'Lycée Blaise Diagne',
        title: 'Professeur Agrégé',
        years: '2018-2024',
        description: "Enseignement des mathématiques, préparation au bac, encadrement d'une équipe pédagogique.",
        achievements: ["100% de réussite au bac 2022", "Création d'un club de maths", "Organisation d'olympiades"],
        startDate: '2018',
        endDate: '2024',
        current: true,
      },
      {
        company: 'Collège Saint-Louis',
        title: 'Professeur de Mathématiques',
        years: '2015-2018',
        description: 'Cours de mathématiques, suivi individualisé, organisation de concours.',
        achievements: ['Lancement du tutorat', 'Encadrement de 5 classes'],
        startDate: '2015',
        endDate: '2018',
        current: false,
      }
    ],
    education: [
      {
        degree: 'Agrégation Mathématiques',
        field: 'Mathématiques',
        institution: 'FASTEF',
        startDate: '2015',
        endDate: '2018',
        description: 'Formation en pédagogie avancée, innovation éducative, enseignement supérieur.'
      },
      {
        degree: 'CAPES Mathématiques',
        field: 'Mathématiques',
        institution: 'FASTEF',
        startDate: '2012',
        endDate: '2015',
        description: 'Formation en pédagogie, enseignement des mathématiques, innovation éducative.'
      }
    ],
    skills: [
      { name: 'Pédagogie', level: 'Expert' },
      { name: 'Mathématiques', level: 'Expert' },
      { name: 'Innovation', level: 'Avancé' },
      { name: 'Encadrement', level: 'Avancé' },
      { name: 'Communication', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Intermédiaire' }
    ],
    certifications: [
      { name: 'Agrégation', issuer: 'FASTEF', date: '2018' },
      { name: 'CAPES', issuer: 'FASTEF', date: '2015' }
    ],
  },
  commerce: {
    personalInfo: {
      firstName: 'Astou',
      lastName: 'Faye',
      title: 'Responsable Commerciale Grands Comptes',
      email: 'astou.faye@email.com',
      phone: '+221 77 567 89 01',
      photo: '/images/avatars/woman-3.png',
      profileImage: '/images/avatars/woman-3.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/astoufaye',
      summary: "Responsable commerciale grands comptes avec 8 ans d'expérience, experte en négociation, développement commercial, gestion d'équipe et fidélisation client. Forte capacité à atteindre les objectifs et à piloter la croissance."
    },
    summary: "Responsable commerciale, experte en négociation, développement commercial et gestion d'équipe.",
    experience: [
      {
        company: 'CFAO',
        title: 'Responsable Commerciale Grands Comptes',
        years: '2020-2024',
        description: "Développement du portefeuille grands comptes, négociation de contrats stratégiques, management d'une équipe de 8 commerciaux.",
        achievements: ["+30% de CA en 2 ans", "Fidélisation de 20 clients majeurs", "Mise en place d'un CRM"],
        startDate: '2020',
        endDate: '2024',
        current: true,
      },
      {
        company: 'SENCOM',
        title: 'Chargée d\'Affaires',
        years: '2017-2020',
        description: 'Prospection, négociation, suivi des ventes, reporting.',
        achievements: ['Ouverture de 3 nouveaux marchés', 'Formation de 2 juniors'],
        startDate: '2017',
        endDate: '2020',
        current: false,
      },
      {
        company: 'Supdeco Junior Entreprise',
        title: 'Assistante Commerciale',
        years: '2014-2017',
        description: 'Support commercial, gestion des appels d\'offres, suivi administratif.',
        achievements: ['Optimisation des process', 'Satisfaction client 95%'],
        startDate: '2014',
        endDate: '2017',
        current: false,
      }
    ],
    education: [
      {
        degree: 'MBA Commerce International',
        field: 'Commerce',
        institution: 'Supdeco',
        startDate: '2018',
        endDate: '2020',
        description: 'Stratégie commerciale, négociation internationale, gestion de projet.'
      },
      {
        degree: 'Master Commerce',
        field: 'Commerce',
        institution: 'Supdeco',
        startDate: '2014',
        endDate: '2018',
        description: 'Formation en vente, négociation et gestion commerciale.'
      }
    ],
    skills: [
      { name: 'Négociation', level: 'Expert' },
      { name: 'Développement commercial', level: 'Expert' },
      { name: 'Gestion d\'équipe', level: 'Avancé' },
      { name: 'Vente', level: 'Avancé' },
      { name: 'Leadership', level: 'Avancé' },
      { name: 'CRM', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Courant' }
    ],
    certifications: [
      { name: 'Certification Vente', issuer: 'Supdeco', date: '2019' },
      { name: 'TOEIC', issuer: 'ETS', date: '2020' }
    ],
  },
  admin: {
    personalInfo: {
      firstName: 'Cheikh',
      lastName: 'Fall',
      title: 'Responsable Ressources Humaines',
      email: 'cheikh.fall@email.com',
      phone: '+221 77 678 90 12',
      photo: '/images/avatars/man-3.png',
      profileImage: '/images/avatars/man-3.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/cheikhfall',
      summary: "Responsable RH avec 10 ans d'expérience, expert en gestion administrative, recrutement, formation, paie et relations sociales. Forte capacité à accompagner la transformation RH et à piloter des projets transverses."
    },
    summary: "Responsable RH, expert en gestion administrative, recrutement, formation et relations sociales.",
    experience: [
      {
        company: 'Senelec',
        title: 'Responsable Ressources Humaines',
        years: '2020-2024',
        description: "Gestion du service RH, supervision de la paie, recrutement, formation, relations sociales, management d'une équipe de 6 personnes.",
        achievements: ["Digitalisation des processus RH", "Mise en place d'un plan de formation", "Réduction du turnover de 20%"],
        startDate: '2020',
        endDate: '2024',
        current: true,
      },
      {
        company: 'Sonatel',
        title: 'Chargé de Recrutement',
        years: '2017-2020',
        description: 'Gestion des recrutements, intégration, suivi des carrières, reporting RH.',
        achievements: ['Recrutement de 100 profils', 'Mise en place d\'un SIRH'],
        startDate: '2017',
        endDate: '2020',
        current: false,
      },
      {
        company: 'UCAD',
        title: 'Assistant RH',
        years: '2014-2017',
        description: 'Gestion administrative du personnel, suivi des dossiers, organisation des formations.',
        achievements: ['Optimisation des dossiers', 'Satisfaction collaborateurs 98%'],
        startDate: '2014',
        endDate: '2017',
        current: false,
      }
    ],
    education: [
      {
        degree: 'MBA Ressources Humaines',
        field: 'Ressources Humaines',
        institution: 'ISM Dakar',
        startDate: '2018',
        endDate: '2020',
        description: 'Stratégie RH, management, droit social, gestion de la paie.'
      },
      {
        degree: 'Licence RH',
        field: 'Ressources Humaines',
        institution: 'UCAD',
        startDate: '2014',
        endDate: '2017',
        description: 'Gestion administrative, recrutement, formation.'
      }
    ],
    skills: [
      { name: 'Gestion administrative', level: 'Expert' },
      { name: 'Recrutement', level: 'Expert' },
      { name: 'Formation', level: 'Avancé' },
      { name: 'Paie', level: 'Avancé' },
      { name: 'Relations sociales', level: 'Avancé' },
      { name: 'SIRH', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Intermédiaire' }
    ],
    certifications: [
      { name: 'Certification RH', issuer: 'ISM Dakar', date: '2020' },
      { name: 'Gestion de la paie', issuer: 'UCAD', date: '2018' }
    ],
  },
  tech: {
    personalInfo: {
      firstName: 'Moussa',
      lastName: 'Gaye',
      title: 'Lead Développeur Full Stack',
      email: 'moussa.gaye@email.com',
      phone: '+221 77 789 01 23',
      photo: '/images/avatars/man-4.png',
      profileImage: '/images/avatars/man-4.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/moussagaye',
      github: 'github.com/moussagaye',
      portfolio: 'moussadev.com',
      summary: "Lead développeur full stack avec 9 ans d'expérience, expert en React, Node.js, architecture logicielle, gestion d'équipe et DevOps. Passionné par l'innovation et la transmission."
    },
    summary: "Lead développeur full stack, expert React, Node.js, architecture logicielle et DevOps.",
    experience: [
      {
        company: 'Wave',
        title: 'Lead Développeur Full Stack',
        years: '2021-2024',
        description: "Conception d'architectures web, développement d'applications à fort trafic, management d'une équipe de 5 développeurs.",
        achievements: ["Migration vers microservices", "Mise en place CI/CD", "Formation de 3 juniors"],
        startDate: '2021',
        endDate: '2024',
        current: true,
      },
      {
        company: 'PayDunya',
        title: 'Développeur Backend',
        years: '2018-2021',
        description: 'Développement d\'API, optimisation des performances, sécurité.',
        achievements: ['Refonte API paiement', 'Automatisation des tests'],
        startDate: '2018',
        endDate: '2021',
        current: false,
      },
      {
        company: 'Freelance',
        title: 'Développeur Web',
        years: '2015-2018',
        description: 'Création de sites et applications pour PME, maintenance, support.',
        achievements: ['+20 projets livrés', 'Satisfaction client 100%'],
        startDate: '2015',
        endDate: '2018',
        current: false,
      }
    ],
    education: [
      {
        degree: 'Ingénieur Logiciel',
        field: 'Informatique',
        institution: 'ESMT',
        startDate: '2012',
        endDate: '2017',
        description: 'Développement logiciel, web, mobile, architecture et sécurité.'
      },
      {
        degree: 'Certification React',
        field: 'Développement Web',
        institution: 'OpenClassrooms',
        startDate: '2019',
        endDate: '2019',
        description: 'Spécialisation en React, hooks, context, tests.'
      },
      {
        degree: 'AWS Cloud Practitioner',
        field: 'Cloud',
        institution: 'Amazon',
        startDate: '2022',
        endDate: '2022',
        description: 'Fondamentaux du cloud, sécurité, déploiement.'
      }
    ],
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'Node.js', level: 'Expert' },
      { name: 'DevOps', level: 'Avancé' },
      { name: 'Gestion d\'équipe', level: 'Avancé' },
      { name: 'CI/CD', level: 'Avancé' },
      { name: 'Sécurité', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Courant' }
    ],
    certifications: [
      { name: 'Certification React', issuer: 'OpenClassrooms', date: '2019' },
      { name: 'AWS Cloud Practitioner', issuer: 'Amazon', date: '2022' }
    ],
    interests: [
      { name: 'Photographie' },
      { name: 'Musique' },
      { name: 'Sport' }
    ]
  },
  logistics: {
    personalInfo: {
      firstName: 'Khady',
      lastName: 'Sow',
      title: 'Responsable Logistique et Supply Chain',
      email: 'khady.sow@email.com',
      phone: '+221 77 890 12 34',
      photo: '/images/avatars/woman-4.png',
      profileImage: '/images/avatars/woman-4.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/khadysow',
      summary: "Responsable logistique avec 8 ans d'expérience, experte en gestion des flux, optimisation des stocks, transport international et management d'équipe. Forte capacité à piloter la performance et à accompagner la croissance."
    },
    summary: "Responsable logistique, experte en gestion des flux, optimisation des stocks et transport international.",
    experience: [
      {
        company: 'DHL Sénégal',
        title: 'Responsable Logistique',
        years: '2020-2024',
        description: "Gestion de la supply chain, optimisation des flux, management d'une équipe de 10 personnes, suivi des indicateurs de performance.",
        achievements: ["Réduction des coûts de 15%", "Mise en place d'un WMS", "Certification ISO 9001"],
        startDate: '2020',
        endDate: '2024',
        current: true,
      },
      {
        company: 'Bolloré Africa Logistics',
        title: 'Coordinatrice Transport',
        years: '2017-2020',
        description: 'Organisation des transports internationaux, gestion des litiges, relation clients.',
        achievements: ['Optimisation des délais', 'Gestion de 50 dossiers/mois'],
        startDate: '2017',
        endDate: '2020',
        current: false,
      },
      {
        company: 'Supdeco Junior Entreprise',
        title: 'Assistante Logistique',
        years: '2015-2017',
        description: 'Gestion des stocks, inventaires, suivi administratif.',
        achievements: ['Mise en place d\'un inventaire digital', 'Réduction des ruptures de stock'],
        startDate: '2015',
        endDate: '2017',
        current: false,
      }
    ],
    education: [
      {
        degree: 'MBA Supply Chain',
        field: 'Logistique',
        institution: 'ISM Dakar',
        startDate: '2018',
        endDate: '2020',
        description: 'Gestion de la supply chain, optimisation des flux, management.'
      },
      {
        degree: 'Master Logistique',
        field: 'Logistique',
        institution: 'ISM',
        startDate: '2015',
        endDate: '2019',
        description: 'Formation en gestion de la chaîne logistique.'
      }
    ],
    skills: [
      { name: 'Gestion des flux', level: 'Expert' },
      { name: 'Supply Chain', level: 'Expert' },
      { name: 'Optimisation des stocks', level: 'Avancé' },
      { name: 'Transport international', level: 'Avancé' },
      { name: 'Management', level: 'Avancé' },
      { name: 'WMS', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Courant' }
    ],
    certifications: [
      { name: 'Certification Supply Chain', issuer: 'ISM Dakar', date: '2020' },
      { name: 'ISO 9001', issuer: 'AFNOR', date: '2021' }
    ],
  },
  btp: {
    personalInfo: {
      firstName: 'Ibrahima',
      lastName: 'Kane',
      title: 'Ingénieur Chef de Projet BTP',
      email: 'ibrahima.kane@email.com',
      phone: '+221 77 901 23 45',
      photo: '/images/avatars/man-5.png',
      profileImage: '/images/avatars/man-5.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/ibrahimakane',
      summary: "Ingénieur chef de projet BTP avec 10 ans d'expérience, expert en gestion de chantiers, conduite de travaux, coordination d'équipes et suivi budgétaire. Forte capacité à piloter des projets d'envergure et à garantir la qualité et la sécurité."
    },
    summary: "Ingénieur chef de projet BTP, expert en gestion de chantiers, conduite de travaux et coordination d'équipes.",
    experience: [
      {
        company: 'Eiffage Sénégal',
        title: 'Ingénieur Chef de Projet',
        years: '2020-2024',
        description: "Gestion de projets de construction, coordination des sous-traitants, suivi des budgets et des délais, management d'une équipe de 15 personnes.",
        achievements: ["Livraison de 3 chantiers majeurs", "Respect du budget à 98%", "Certification HQE"],
        startDate: '2020',
        endDate: '2024',
        current: true,
      },
      {
        company: 'SOGEA SATOM',
        title: 'Conducteur de Travaux',
        years: '2016-2020',
        description: 'Suivi de chantiers, gestion des équipes, contrôle qualité, sécurité.',
        achievements: ['Réduction des accidents de 30%', 'Optimisation des plannings'],
        startDate: '2016',
        endDate: '2020',
        current: false,
      },
      {
        company: 'ESP Dakar',
        title: 'Assistant Ingénieur',
        years: '2013-2016',
        description: 'Préparation des dossiers techniques, suivi administratif, assistance sur site.',
        achievements: ['Mise en place d\'un système de reporting', 'Formation de 5 techniciens'],
        startDate: '2013',
        endDate: '2016',
        current: false,
      }
    ],
    education: [
      {
        degree: 'Diplôme d\'Ingénieur BTP',
        field: 'BTP',
        institution: 'ESP Dakar',
        startDate: '2008',
        endDate: '2013',
        description: 'Génie civil, gestion de projets, sécurité, qualité.'
      },
      {
        degree: 'Certification HQE',
        field: 'Qualité Environnementale',
        institution: 'AFNOR',
        startDate: '2021',
        endDate: '2021',
        description: 'Haute Qualité Environnementale, normes et suivi.'
      }
    ],
    skills: [
      { name: 'Gestion de projet', level: 'Expert' },
      { name: 'Conduite de travaux', level: 'Expert' },
      { name: 'Sécurité', level: 'Avancé' },
      { name: 'Qualité', level: 'Avancé' },
      { name: 'Coordination', level: 'Avancé' },
      { name: 'Budget', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Intermédiaire' }
    ],
    certifications: [
      { name: 'Certification HQE', issuer: 'AFNOR', date: '2021' },
      { name: 'Sécurité Chantier', issuer: 'ESP Dakar', date: '2015' }
    ],
  },
  art: {
    personalInfo: {
      firstName: 'Seynabou',
      lastName: 'Diallo',
      title: 'Directrice Artistique',
      email: 'seynabou.diallo@email.com',
      phone: '+221 77 987 65 43',
      photo: '/images/avatars/woman-4.png',
      profileImage: '/images/avatars/woman-4.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/seynaboudiallo',
      portfolio: 'seynaboudesign.com',
      summary: "Directrice artistique avec 9 ans d'expérience, experte en design graphique, illustration, direction créative et gestion de projets artistiques. Forte capacité à innover et à piloter des équipes créatives. Lauréate de plusieurs prix internationaux."
    },
    summary: "Directrice artistique, experte en design graphique, illustration, direction créative et gestion de projets artistiques.",
    experience: [
      {
        company: 'Studio Dakar',
        title: 'Directrice Artistique',
        years: '2020-2024',
        description: "Direction de projets créatifs, conception d'identités visuelles, management d'une équipe de 6 graphistes.",
        achievements: ["Prix Design Afrique 2022", "Création de 10 identités de marque", "Lancement d'une collection d'affiches primée"],
        startDate: '2020',
        endDate: '2024',
        current: true,
      },
      {
        company: 'Agence Baobab',
        title: 'Graphiste Senior',
        years: '2017-2020',
        description: 'Création de visuels, illustrations, supports de communication, gestion de projets clients.',
        achievements: ['Campagne nationale primée', 'Formation de 3 juniors', "Exposition collective à Dakar Art Week"],
        startDate: '2017',
        endDate: '2020',
        current: false,
      },
      {
        company: 'Ecole des Arts',
        title: 'Assistante Graphiste',
        years: '2014-2017',
        description: "Soutien aux projets étudiants, création d'affiches, gestion de l'atelier, animation d'ateliers créatifs.",
        achievements: ['Exposition collective', 'Création de supports pédagogiques', 'Ateliers pour enfants'],
        startDate: '2014',
        endDate: '2017',
        current: false,
      }
    ],
    education: [
      {
        degree: 'Master Design Graphique',
        field: 'Design',
        institution: 'Ecole des Arts',
        startDate: '2017',
        endDate: '2019',
        description: 'Design graphique, direction artistique, illustration, projet de fin d\'études sur l\'identité visuelle des ONG africaines.'
      },
      {
        degree: 'Licence Design',
        field: 'Design',
        institution: 'Ecole des Arts',
        startDate: '2014',
        endDate: '2017',
        description: 'Formation en design graphique, illustration, histoire de l\'art.'
      }
    ],
    skills: [
      { name: 'Design graphique', level: 'Expert' },
      { name: 'Direction artistique', level: 'Expert' },
      { name: 'Illustration', level: 'Avancé' },
      { name: 'Créativité', level: 'Avancé' },
      { name: 'Gestion de projet', level: 'Avancé' },
      { name: 'Adobe Suite', level: 'Avancé' },
      { name: 'Photographie', level: 'Intermédiaire' },
      { name: 'Animation digitale', level: 'Intermédiaire' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Intermédiaire' },
      { name: 'Espagnol', level: 'Débutant' }
    ],
    certifications: [
      { name: 'Certification Adobe', issuer: 'Adobe', date: '2020' },
      { name: 'Prix Design Afrique', issuer: 'Design Awards', date: '2022' },
      { name: 'Certificat UX/UI', issuer: 'Coursera', date: '2021' }
    ],
    interests: [
      'Peinture contemporaine',
      'Voyages culturels',
      'Photographie urbaine',
      'Musique jazz',
      'Bénévolat artistique'
    ],
    projects: [
      { name: 'Affiches pour Dakar Art Week', description: 'Création d\'une série d\'affiches pour un événement artistique international.', year: '2023' },
      { name: 'Identité visuelle ONG Femmes Solidaires', description: 'Conception de la charte graphique et du logo pour une ONG.', year: '2022' },
      { name: "Exposition 'Couleurs d'Afrique'", description: 'Organisation et participation à une exposition collective.', year: '2021' }
    ]
  },
  hotel: {
    personalInfo: {
      firstName: 'Mame Diarra',
      lastName: 'Sy',
      title: 'Responsable Accueil et Réception',
      email: 'mame.diarra@email.com',
      phone: '+221 77 345 12 34',
      photo: '/images/avatars/woman-2.png',
      profileImage: '/images/avatars/woman-2.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/mamediarrasy',
      summary: "Responsable accueil et réception avec 7 ans d'expérience, experte en gestion de la relation client, organisation d'événements, management d'équipe et gestion des réservations. Sens du service et excellente présentation."
    },
    summary: "Responsable accueil et réception, experte en gestion de la relation client, organisation et management.",
    experience: [
      {
        company: 'Radisson Blu Dakar',
        title: 'Responsable Accueil',
        years: '2021-2024',
        description: "Gestion de l'accueil, organisation des arrivées/départs, management d'une équipe de 8 réceptionnistes, gestion des réclamations.",
        achievements: ["Taux de satisfaction client 98%", "Mise en place d'un process VIP", "Formation de 4 juniors"],
        startDate: '2021',
        endDate: '2024',
        current: true,
      },
      {
        company: 'Pullman Dakar',
        title: 'Réceptionniste Senior',
        years: '2018-2021',
        description: 'Accueil, gestion des réservations, organisation d\'événements, suivi administratif.',
        achievements: ['Organisation de 20 séminaires', 'Gestion de 200 clients/jour'],
        startDate: '2018',
        endDate: '2021',
        current: false,
      },
      {
        company: 'Ecole Hôtelière',
        title: 'Assistante Accueil',
        years: '2016-2018',
        description: 'Accueil, gestion des appels, soutien administratif.',
        achievements: ['Mise en place d\'un guide d\'accueil', 'Satisfaction stagiaires 100%'],
        startDate: '2016',
        endDate: '2018',
        current: false,
      }
    ],
    education: [
      {
        degree: 'BTS Hôtellerie',
        field: 'Hôtellerie',
        institution: 'Ecole Hôtelière',
        startDate: '2014',
        endDate: '2016',
        description: 'Accueil, gestion hôtelière, langues, organisation d\'événements.'
      }
    ],
    skills: [
      { name: 'Accueil', level: 'Expert' },
      { name: 'Gestion de la relation client', level: 'Expert' },
      { name: 'Organisation', level: 'Avancé' },
      { name: 'Gestion des réservations', level: 'Avancé' },
      { name: 'Management', level: 'Avancé' },
      { name: 'Langues', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Courant' },
      { name: 'Espagnol', level: 'Débutant' }
    ],
    certifications: [
      { name: 'Certification Accueil', issuer: 'Ecole Hôtelière', date: '2016' },
      { name: 'TOEIC', issuer: 'ETS', date: '2018' }
    ],
  },
  law: {
    personalInfo: {
      firstName: 'Serigne',
      lastName: 'Mbaye',
      title: 'Juriste Sénior',
      email: 'serigne.mbaye@email.com',
      phone: '+221 77 456 12 34',
      photo: '/images/avatars/man-2.png',
      profileImage: '/images/avatars/man-2.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/serignembaye',
      summary: "Juriste sénior, expert en droit sénégalais, conseil, contentieux et rédaction d'actes."
    },
    summary: "Juriste sénior, expert en droit sénégalais, conseil et contentieux.",
    experience: [
      {
        company: 'Cabinet Ba',
        title: 'Juriste Sénior',
        years: '2019-2024',
        description: "Conseil juridique, rédaction d'actes, gestion de contentieux complexes, accompagnement de clients institutionnels.",
        achievements: ["Rédaction de 200 actes juridiques", "Gestion de 30 dossiers contentieux", "Formation de 5 juniors"],
        startDate: '2019',
        endDate: '2024',
        current: true,
      },
      {
        company: 'Ministère de la Justice',
        title: 'Juriste',
        years: '2017-2019',
        description: 'Analyse juridique, veille réglementaire, rédaction de notes.',
        achievements: ['Mise à jour du code interne', 'Participation à des réformes'],
        startDate: '2017',
        endDate: '2019',
        current: false,
      }
    ],
    education: [
      {
        degree: 'Master Droit',
        field: 'Droit',
        institution: 'UCAD',
        startDate: '2012',
        endDate: '2017',
        description: "Formation en droit sénégalais, conseil, contentieux et rédaction d'actes."
      },
      {
        degree: 'Certificat Pratique Juridique',
        field: 'Droit',
        institution: 'ENAM',
        startDate: '2018',
        endDate: '2019',
        description: 'Spécialisation en pratique juridique et contentieux.'
      }
    ],
    skills: [
      { name: 'Droit', level: 'Expert' },
      { name: 'Rédaction', level: 'Avancé' },
      { name: 'Conseil', level: 'Avancé' },
      { name: 'Contentieux', level: 'Avancé' },
      { name: 'Analyse', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Intermédiaire' }
    ],
    certifications: [
      { name: 'Certificat Pratique Juridique', issuer: 'ENAM', date: '2019' }
    ],
  },
  com: {
    personalInfo: {
      firstName: 'Aminata',
      lastName: 'Cissé',
      title: 'Rédactrice en Chef',
      email: 'aminata.cisse@email.com',
      phone: '+221 77 567 12 34',
      photo: '/images/avatars/woman-1.png',
      profileImage: '/images/avatars/woman-1.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/aminatacisse',
      portfolio: 'aminatacisse.com',
      summary: "Rédactrice en chef avec 10 ans d'expérience, experte en journalisme, communication, animation éditoriale et gestion d'équipe. Forte capacité à piloter des projets médias et à innover dans la production de contenus."
    },
    summary: "Rédactrice en chef, experte en journalisme, communication et gestion éditoriale.",
    experience: [
      {
        company: 'RTS',
        title: 'Rédactrice en Chef',
        years: '2020-2024',
        description: "Supervision de la rédaction, animation de conférences de rédaction, gestion d'une équipe de 12 journalistes, pilotage de projets éditoriaux.",
        achievements: ["Lancement d'une nouvelle émission", "Prix Média Sénégal 2022", "Formation de 5 journalistes"],
        startDate: '2020',
        endDate: '2024',
        current: true,
      },
      {
        company: 'Le Soleil',
        title: 'Journaliste Reporter',
        years: '2016-2020',
        description: 'Rédaction de reportages, interviews, enquêtes, animation de rubriques.',
        achievements: ['Prix du meilleur reportage', 'Couverture de 3 grands événements'],
        startDate: '2016',
        endDate: '2020',
        current: false,
      },
      {
        company: 'CESTI',
        title: 'Assistante Communication',
        years: '2014-2016',
        description: 'Soutien à la communication interne, organisation d\'événements, rédaction de supports.',
        achievements: ['Création d\'une newsletter', 'Organisation de 2 conférences'],
        startDate: '2014',
        endDate: '2016',
        current: false,
      }
    ],
    education: [
      {
        degree: 'Master Journalisme',
        field: 'Journalisme',
        institution: 'CESTI',
        startDate: '2016',
        endDate: '2018',
        description: 'Journalisme, communication, gestion éditoriale.'
      },
      {
        degree: 'Licence Journalisme',
        field: 'Journalisme',
        institution: 'CESTI',
        startDate: '2013',
        endDate: '2016',
        description: 'Formation en communication, médias et rédaction.'
      }
    ],
    skills: [
      { name: 'Journalisme', level: 'Expert' },
      { name: 'Communication', level: 'Expert' },
      { name: 'Gestion éditoriale', level: 'Avancé' },
      { name: 'Interview', level: 'Avancé' },
      { name: 'Animation', level: 'Avancé' },
      { name: 'Rédaction', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Courant' }
    ],
    certifications: [
      { name: 'Prix Média Sénégal', issuer: 'RTS', date: '2022' },
      { name: 'Certification Communication', issuer: 'CESTI', date: '2018' }
    ],
  },
  agro: {
    personalInfo: {
      firstName: 'Modou',
      lastName: 'Sarr',
      title: 'Ingénieur Agronome Senior',
      email: 'modou.sarr@email.com',
      phone: '+221 77 678 12 34',
      photo: '/images/avatars/man-1.png',
      profileImage: '/images/avatars/man-1.png',
      address: 'Saint-Louis, Sénégal',
      linkedin: 'linkedin.com/in/modousarr',
      summary: "Ingénieur agronome senior avec 12 ans d'expérience, expert en agriculture durable, gestion de projets, agroéconomie et formation. Forte capacité à piloter des programmes de développement rural et à accompagner l'innovation agricole."
    },
    summary: "Ingénieur agronome senior, expert en agriculture durable, gestion de projets et agroéconomie.",
    experience: [
      {
        company: 'SODEFITEX',
        title: 'Chef de Projet Agronome',
        years: '2018-2024',
        description: "Gestion de projets agricoles, accompagnement des producteurs, suivi des indicateurs de performance, management d'une équipe de 10 techniciens.",
        achievements: ["Lancement d'un programme coton bio", "Augmentation des rendements de 20%", "Formation de 50 agriculteurs"],
        startDate: '2018',
        endDate: '2024',
        current: true,
      },
      {
        company: 'ENSA Thiès',
        title: 'Chargé de Recherche',
        years: '2014-2018',
        description: 'Recherche en agroéconomie, expérimentation, publication scientifique.',
        achievements: ['3 articles publiés', 'Mise en place d\'un laboratoire'],
        startDate: '2014',
        endDate: '2018',
        current: false,
      },
      {
        company: 'UCAD',
        title: 'Assistant Agronome',
        years: '2011-2014',
        description: 'Appui aux projets étudiants, suivi de terrain, formation.',
        achievements: ['Encadrement de 20 étudiants', 'Organisation de 2 séminaires'],
        startDate: '2011',
        endDate: '2014',
        current: false,
      }
    ],
    education: [
      {
        degree: 'Doctorat Agroéconomie',
        field: 'Agroéconomie',
        institution: 'ENSA Thiès',
        startDate: '2015',
        endDate: '2018',
        description: 'Agroéconomie, gestion de projets, innovation agricole.'
      },
      {
        degree: 'Ingénieur Agronome',
        field: 'Agriculture',
        institution: 'ENSA Thiès',
        startDate: '2011',
        endDate: '2015',
        description: 'Formation en agriculture durable et gestion de projets.'
      }
    ],
    skills: [
      { name: 'Agriculture durable', level: 'Expert' },
      { name: 'Gestion de projet', level: 'Expert' },
      { name: 'Agroéconomie', level: 'Avancé' },
      { name: 'Formation', level: 'Avancé' },
      { name: 'Innovation', level: 'Avancé' },
      { name: 'Management', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Courant' }
    ],
    certifications: [
      { name: 'Certification Agriculture Durable', issuer: 'ENSA Thiès', date: '2017' },
      { name: 'Prix Innovation Agricole', issuer: 'SODEFITEX', date: '2021' }
    ],
  },
  human: {
    personalInfo: {
      firstName: 'Mariama',
      lastName: 'Diallo',
      title: 'Coordinatrice de Projets Humanitaires',
      email: 'mariama.diallo@email.com',
      phone: '+221 77 789 12 34',
      photo: '/images/avatars/woman-5.png',
      profileImage: '/images/avatars/woman-5.png',
      address: 'Thiès, Sénégal',
      linkedin: 'linkedin.com/in/mariamadiane',
      summary: "Coordinatrice de projets humanitaires avec 9 ans d'expérience, experte en gestion de programmes, coordination d'équipes, levée de fonds et suivi-évaluation. Forte capacité à piloter des missions d'urgence et à accompagner le développement local."
    },
    summary: "Coordinatrice de projets humanitaires, experte en gestion de programmes, coordination et suivi-évaluation.",
    experience: [
      {
        company: 'Croix-Rouge',
        title: 'Coordinatrice de Projets',
        years: '2020-2024',
        description: "Gestion de programmes humanitaires, coordination d'équipes pluridisciplinaires, suivi budgétaire, reporting aux bailleurs.",
        achievements: ["Levée de 500K€ de fonds", "Mise en place d'un système de suivi-évaluation", "Formation de 10 volontaires"],
        startDate: '2020',
        endDate: '2024',
        current: true,
      },
      {
        company: 'Plan International',
        title: 'Chargée de Mission',
        years: '2016-2020',
        description: 'Gestion de projets enfance, animation d\'ateliers, suivi des indicateurs.',
        achievements: ['Organisation de 15 ateliers', 'Soutien à 200 enfants'],
        startDate: '2016',
        endDate: '2020',
        current: false,
      },
      {
        company: 'UCAD',
        title: 'Assistante Humanitaire',
        years: '2014-2016',
        description: 'Appui administratif, organisation de missions, rédaction de rapports.',
        achievements: ['Optimisation des process', 'Satisfaction partenaires 98%'],
        startDate: '2014',
        endDate: '2016',
        current: false,
      }
    ],
    education: [
      {
        degree: 'Master Action Humanitaire',
        field: 'Action Humanitaire',
        institution: 'UCAD',
        startDate: '2014',
        endDate: '2019',
        description: 'Gestion de projets humanitaires, développement local, levée de fonds.'
      },
      {
        degree: 'Licence Sociologie',
        field: 'Sociologie',
        institution: 'UCAD',
        startDate: '2011',
        endDate: '2014',
        description: 'Analyse sociale, développement communautaire.'
      }
    ],
    skills: [
      { name: 'Gestion de projet', level: 'Expert' },
      { name: 'Coordination', level: 'Expert' },
      { name: 'Suivi-évaluation', level: 'Avancé' },
      { name: 'Levée de fonds', level: 'Avancé' },
      { name: 'Animation', level: 'Avancé' },
      { name: 'Communication', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Courant' }
    ],
    certifications: [
      { name: 'Certification Gestion de Projet', issuer: 'Plan International', date: '2018' },
      { name: 'Prix Humanitaire', issuer: 'Croix-Rouge', date: '2022' }
    ],
  },
  bank: {
    personalInfo: {
      firstName: 'Papa',
      lastName: 'Sow',
      title: 'Conseiller Bancaire Senior',
      email: 'papa.sow@email.com',
      phone: '+221 77 890 23 45',
      photo: '/images/avatars/man-5.png',
      profileImage: '/images/avatars/man-5.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/papasow',
      summary: "Conseiller bancaire senior avec 11 ans d'expérience, expert en gestion de portefeuilles, conseil patrimonial, relation client et conformité. Forte capacité à fidéliser la clientèle et à développer l'activité commerciale."
    },
    summary: "Conseiller bancaire senior, expert en gestion de portefeuilles, conseil patrimonial et conformité.",
    experience: [
      {
        company: 'CBAO',
        title: 'Conseiller Bancaire Senior',
        years: '2018-2024',
        description: "Gestion de portefeuilles clients, conseil patrimonial, développement commercial, suivi de la conformité, management d'une équipe de 4 conseillers.",
        achievements: ["+200 clients fidélisés", "Mise en place d'un process conformité", "Prix du meilleur conseiller 2022"],
        startDate: '2018',
        endDate: '2024',
        current: true,
      },
      {
        company: 'Société Générale',
        title: 'Chargé de Clientèle',
        years: '2014-2018',
        description: 'Gestion de comptes, analyse de besoins, vente de produits bancaires.',
        achievements: ['Développement d\'un portefeuille PME', 'Formation de 2 juniors'],
        startDate: '2014',
        endDate: '2018',
        current: false,
      },
      {
        company: 'ISM',
        title: 'Assistant Back Office',
        years: '2011-2014',
        description: 'Traitement des opérations, suivi administratif, support aux conseillers.',
        achievements: ['Optimisation des process', 'Réduction des délais de traitement'],
        startDate: '2011',
        endDate: '2014',
        current: false,
      }
    ],
    education: [
      {
        degree: 'Master Banque et Finance',
        field: 'Banque',
        institution: 'ISM',
        startDate: '2015',
        endDate: '2017',
        description: 'Gestion bancaire, finance, conformité, relation client.'
      },
      {
        degree: 'Licence Banque',
        field: 'Banque',
        institution: 'ISM',
        startDate: '2011',
        endDate: '2015',
        description: 'Formation en gestion bancaire et relation client.'
      }
    ],
    skills: [
      { name: 'Gestion de portefeuilles', level: 'Expert' },
      { name: 'Conseil patrimonial', level: 'Expert' },
      { name: 'Relation client', level: 'Avancé' },
      { name: 'Conformité', level: 'Avancé' },
      { name: 'Vente', level: 'Avancé' },
      { name: 'Analyse financière', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Courant' }
    ],
    certifications: [
      { name: 'Certification AMF', issuer: 'Autorité des Marchés Financiers', date: '2018' },
      { name: 'Prix du Meilleur Conseiller', issuer: 'CBAO', date: '2022' }
    ],
  },
  techModern: {
    personalInfo: {
      firstName: 'Moussa',
      lastName: 'Gaye',
      title: 'Lead Développeur Full Stack',
      email: 'moussa.gaye@email.com',
      phone: '+221 77 789 01 23',
      photo: '/images/avatars/man-4.png',
      profileImage: '/images/avatars/man-4.png',
      address: 'Dakar, Sénégal',
      linkedin: 'linkedin.com/in/moussagaye',
      portfolio: 'moussadev.com',
      summary: "Lead développeur full stack avec 9 ans d'expérience, expert en React, Node.js, architecture logicielle, gestion d'équipe et DevOps. Passionné par l'innovation et la transmission."
    },
    summary: "Lead développeur full stack, expert React, Node.js, architecture logicielle et DevOps.",
    experience: [
      {
        company: 'Wave',
        title: 'Lead Développeur Full Stack',
        years: '2021-2024',
        description: "Conception d'architectures web, développement d'applications à fort trafic, management d'une équipe de 5 développeurs.",
        achievements: ["Migration vers microservices", "Mise en place CI/CD", "Formation de 3 juniors"],
        startDate: '2021',
        endDate: '2024',
        current: true,
      },
      {
        company: 'PayDunya',
        title: 'Développeur Backend',
        years: '2018-2021',
        description: "Développement d'API, optimisation des performances, sécurité.",
        achievements: ["Refonte API paiement", "Automatisation des tests"],
        startDate: '2018',
        endDate: '2021',
        current: false,
      },
      {
        company: 'Freelance',
        title: 'Développeur Web',
        years: '2015-2018',
        description: "Création de sites et applications pour PME, maintenance, support.",
        achievements: ['+20 projets livrés', 'Satisfaction client 100%'],
        startDate: '2015',
        endDate: '2018',
        current: false,
      }
    ],
    education: [
      {
        degree: 'Ingénieur Logiciel',
        field: 'Informatique',
        institution: 'ESMT',
        startDate: '2012',
        endDate: '2017',
        description: 'Développement logiciel, web, mobile, architecture et sécurité.'
      },
      {
        degree: 'Certification React',
        field: 'Développement Web',
        institution: 'OpenClassrooms',
        startDate: '2019',
        endDate: '2019',
        description: 'Spécialisation en React, hooks, context, tests.'
      },
      {
        degree: 'AWS Cloud Practitioner',
        field: 'Cloud',
        institution: 'Amazon',
        startDate: '2022',
        endDate: '2022',
        description: 'Fondamentaux du cloud, sécurité, déploiement.'
      }
    ],
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'Node.js', level: 'Expert' },
      { name: 'DevOps', level: 'Avancé' },
      { name: 'Gestion d\'équipe', level: 'Avancé' },
      { name: 'CI/CD', level: 'Avancé' },
      { name: 'Sécurité', level: 'Avancé' }
    ],
    languages: [
      { name: 'Français', level: 'Bilingue' },
      { name: 'Anglais', level: 'Courant' }
    ],
    certifications: [
      { name: 'Certification React', issuer: 'OpenClassrooms', date: '2019' },
      { name: 'AWS Cloud Practitioner', issuer: 'Amazon', date: '2022' }
    ],
    interests: [
      { name: 'Photographie' },
      { name: 'Musique' },
      { name: 'Sport' }
    ]
  },
};

const CVPreviewGallery: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const template = CV_TEMPLATES.find(t => t.id === templateId);

  if (!template) {
    return <Alert type="error" message="Modèle introuvable" />;
  }
  
  const demoData = DEMO_PROFILES[templateId as keyof typeof DEMO_PROFILES] || DEMO_PROFILES.finance;

  return (
    <div style={{ padding: '24px', width: '100%', maxWidth: '100vw', boxSizing: 'border-box' }}>
      <Card
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          borderRadius: 16
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>{template.name}</Title>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Alert message={`Ceci est un aperçu du modèle ${template.name}. Les informations ci-dessous sont des données de démonstration.`} type="info" showIcon />
        </div>
        <CVPreview data={demoData} customization={defaultCustomization} template={template} isPremium={true} />
      </Card>
    </div>
  );
};

export default CVPreviewGallery;

export { DEMO_PROFILES }; 