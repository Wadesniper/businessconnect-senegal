import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Typography, Button, Space, Tag, Input, Tabs, Modal, Statistic, Spin } from 'antd';
import { SearchOutlined, ArrowRightOutlined, EnvironmentOutlined, BookOutlined, TrophyOutlined, LockOutlined } from '@ant-design/icons';
import type { Secteur, FicheMetier, Competence } from './types';
import { formatNumberToCurrency } from '../../utils/format';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../hooks/useSubscription';
import { hasPremiumAccess } from '../../utils/premiumAccess';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

const secteurs: Secteur[] = [
  {
    id: 'tech',
    nom: 'Technologies & Numérique',
    description: 'Les métiers du numérique et des nouvelles technologies',
    icone: '💻',
    couleur: '#1890ff',
    metiers: [
      {
        id: 'dev-fullstack',
        titre: 'Développeur Full Stack',
        description: 'Développe des applications web complètes, du backend au frontend',
        secteur: 'tech',
        competencesRequises: [
          { nom: 'JavaScript/TypeScript', niveau: 'avancé' },
          { nom: 'React/Angular/Vue', niveau: 'avancé' },
          { nom: 'Node.js', niveau: 'avancé' },
          { nom: 'SQL/NoSQL', niveau: 'intermédiaire' },
          { nom: 'Git', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1500000 },
          senior: { min: 1500000, max: 3000000 }
        },
        formation: [
          'Bac+4/5 en Informatique',
          'École d\'ingénieur',
          'Formations certifiantes'
        ],
        perspectives: [
          'Lead Developer',
          'Architecte logiciel',
          'CTO'
        ],
        environnementTravail: [
          'Startups',
          'ESN',
          'Grandes entreprises'
        ],
        tags: ['Développement', 'Web', 'Mobile', 'Cloud']
      },
      {
        id: 'data-scientist',
        titre: 'Data Scientist',
        description: 'Analyse et interprète les données pour en tirer des insights stratégiques',
        secteur: 'tech',
        competencesRequises: [
          { nom: 'Python', niveau: 'avancé' },
          { nom: 'Machine Learning', niveau: 'avancé' },
          { nom: 'SQL', niveau: 'intermédiaire' },
          { nom: 'Statistiques', niveau: 'avancé' },
          { nom: 'Big Data', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 4000000 }
        },
        formation: [
          'Bac+5 en Data Science',
          'Master en Statistiques',
          'École d\'ingénieur'
        ],
        perspectives: [
          'Lead Data Scientist',
          'Chief Data Officer',
          'AI Research Scientist'
        ],
        environnementTravail: [
          'Banques',
          'Télécoms',
          'Consulting'
        ],
        tags: ['Data', 'IA', 'Machine Learning', 'Statistiques']
      },
      {
        id: 'cybersecurity-expert',
        titre: 'Expert en Cybersécurité',
        description: 'Protège les systèmes informatiques et les données sensibles contre les cyberattaques',
        secteur: 'tech',
        competencesRequises: [
          { nom: 'Sécurité réseau', niveau: 'expert' },
          { nom: 'Cryptographie', niveau: 'avancé' },
          { nom: 'Ethical Hacking', niveau: 'avancé' },
          { nom: 'Forensics', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 900000 },
          confirme: { min: 900000, max: 1800000 },
          senior: { min: 1800000, max: 3500000 }
        },
        formation: [
          'Master en Sécurité Informatique',
          'Certifications (CISSP, CEH)',
          'Formation continue'
        ],
        perspectives: [
          'RSSI',
          'Consultant en cybersécurité',
          'Directeur sécurité'
        ],
        environnementTravail: [
          'Banques',
          'Télécoms',
          'Cabinets de conseil'
        ],
        tags: ['Sécurité', 'IT', 'Cybersécurité']
      },
      {
        id: 'mobile-dev',
        titre: 'Développeur Mobile',
        description: 'Crée des applications mobiles pour iOS et Android',
        secteur: 'tech',
        competencesRequises: [
          { nom: 'Swift/Kotlin', niveau: 'expert' },
          { nom: 'Flutter', niveau: 'avancé' },
          { nom: 'React Native', niveau: 'avancé' },
          { nom: 'UX Mobile', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1500000 },
          senior: { min: 1500000, max: 2800000 }
        },
        formation: [
          'Licence en Informatique',
          'École de développement',
          'Certifications Apple/Google'
        ],
        perspectives: [
          'Lead Mobile Developer',
          'Architecte Mobile',
          'Chef de projet mobile'
        ],
        environnementTravail: [
          'Startups',
          'Agences de dev',
          'Éditeurs de logiciels'
        ],
        tags: ['Mobile', 'iOS', 'Android', 'Apps']
      },
      {
        id: 'cloud-architect',
        titre: 'Architecte Cloud',
        description: 'Conçoit et met en place les infrastructures cloud des entreprises',
        secteur: 'tech',
        competencesRequises: [
          { nom: 'AWS/Azure/GCP', niveau: 'expert' },
          { nom: 'DevOps', niveau: 'avancé' },
          { nom: 'Sécurité Cloud', niveau: 'expert' },
          { nom: 'Architecture système', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1400000 },
          confirme: { min: 1400000, max: 2800000 },
          senior: { min: 2800000, max: 4500000 }
        },
        formation: [
          'Ingénieur informatique',
          'Certifications Cloud',
          'Formation continue'
        ],
        perspectives: [
          'Chief Cloud Officer',
          'Architecte solutions',
          'Consultant Cloud'
        ],
        environnementTravail: [
          'ESN',
          'Grandes entreprises',
          'Startups'
        ],
        tags: ['Cloud', 'DevOps', 'Architecture']
      },
      {
        id: 'ia-engineer',
        titre: 'Ingénieur IA',
        description: 'Développe des solutions d\'intelligence artificielle',
        secteur: 'tech',
        competencesRequises: [
          { nom: 'Deep Learning', niveau: 'expert' },
          { nom: 'Python/TensorFlow', niveau: 'expert' },
          { nom: 'Big Data', niveau: 'avancé' },
          { nom: 'MLOps', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1500000 },
          confirme: { min: 1500000, max: 3000000 },
          senior: { min: 3000000, max: 5000000 }
        },
        formation: [
          'Master IA',
          'Doctorat',
          'Certifications IA'
        ],
        perspectives: [
          'Lead AI Engineer',
          'Directeur R&D',
          'Entrepreneur IA'
        ],
        environnementTravail: [
          'Startups IA',
          'Centres R&D',
          'Grands groupes'
        ],
        tags: ['IA', 'Machine Learning', 'Innovation']
      },
      {
        id: 'devops-engineer',
        titre: 'Ingénieur DevOps',
        description: 'Automatise et optimise les processus de développement et de déploiement',
        secteur: 'tech',
        competencesRequises: [
          { nom: 'CI/CD', niveau: 'expert' },
          { nom: 'Docker/Kubernetes', niveau: 'expert' },
          { nom: 'Cloud (AWS/Azure)', niveau: 'avancé' },
          { nom: 'Scripting', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Ingénieur informatique',
          'Certifications DevOps',
          'Certifications Cloud'
        ],
        perspectives: [
          'Lead DevOps',
          'Architecte Cloud',
          'SRE Manager'
        ],
        environnementTravail: [
          'Startups',
          'ESN',
          'Grands groupes'
        ],
        tags: ['DevOps', 'Cloud', 'Automatisation']
      },
      {
        id: 'sre-engineer',
        titre: 'Site Reliability Engineer',
        description: 'Assure la fiabilité et la performance des systèmes',
        secteur: 'tech',
        competencesRequises: [
          { nom: 'SRE', niveau: 'expert' },
          { nom: 'Monitoring', niveau: 'expert' },
          { nom: 'Performance', niveau: 'avancé' },
          { nom: 'Automation', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1400000 },
          confirme: { min: 1400000, max: 2800000 },
          senior: { min: 2800000, max: 4500000 }
        },
        formation: [
          'Ingénieur système',
          'Certifications SRE',
          'Formation DevOps'
        ],
        perspectives: [
          'SRE Manager',
          'Architecte système',
          'DevOps Leader'
        ],
        environnementTravail: [
          'Grandes entreprises',
          'Startups scale-up',
          'Plateformes cloud'
        ],
        tags: ['SRE', 'DevOps', 'Performance']
      }
    ]
  },
  {
    id: 'finance',
    nom: 'Finance & Banque',
    description: 'Les métiers de la finance, de la banque et de l\'assurance',
    icone: '💰',
    couleur: '#52c41a',
    metiers: [
      {
        id: 'analyste-financier',
        titre: 'Analyste Financier',
        description: 'Analyse les données financières et conseille sur les investissements',
        secteur: 'finance',
        competencesRequises: [
          { nom: 'Analyse financière', niveau: 'expert' },
          { nom: 'Excel', niveau: 'expert' },
          { nom: 'Modélisation financière', niveau: 'avancé' },
          { nom: 'Bloomberg Terminal', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 900000 },
          confirme: { min: 900000, max: 1800000 },
          senior: { min: 1800000, max: 3500000 }
        },
        formation: [
          'Master en Finance',
          'École de commerce',
          'CFA'
        ],
        perspectives: [
          'Senior Analyste',
          'Gestionnaire de portefeuille',
          'Directeur des investissements'
        ],
        environnementTravail: [
          'Banques d\'investissement',
          'Sociétés de gestion',
          'Cabinets de conseil'
        ],
        tags: ['Finance', 'Investissement', 'Analyse', 'Marchés']
      },
      {
        id: 'comptable',
        titre: 'Expert Comptable',
        description: 'Gère la comptabilité et conseille sur les aspects financiers et fiscaux',
        secteur: 'finance',
        competencesRequises: [
          { nom: 'Comptabilité', niveau: 'expert' },
          { nom: 'Fiscalité', niveau: 'expert' },
          { nom: 'Logiciels comptables', niveau: 'avancé' },
          { nom: 'Droit des sociétés', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 450000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 3000000 }
        },
        formation: [
          'DESCF',
          'Master en Comptabilité',
          'Diplôme d\'expertise comptable'
        ],
        perspectives: [
          'Associé cabinet comptable',
          'DAF',
          'Consultant financier'
        ],
        environnementTravail: [
          'Cabinets comptables',
          'Entreprises',
          'Banques'
        ],
        tags: ['Comptabilité', 'Finance', 'Fiscalité']
      },
      {
        id: 'risk-manager',
        titre: 'Risk Manager',
        description: 'Identifie et gère les risques financiers de l\'entreprise',
        secteur: 'finance',
        competencesRequises: [
          { nom: 'Analyse des risques', niveau: 'expert' },
          { nom: 'Modélisation financière', niveau: 'avancé' },
          { nom: 'Réglementation bancaire', niveau: 'avancé' },
          { nom: 'Statistiques', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Master en Finance',
          'Certifications FRM/PRM',
          'Formation réglementaire'
        ],
        perspectives: [
          'Directeur des risques',
          'Consultant risques',
          'Responsable conformité'
        ],
        environnementTravail: [
          'Banques',
          'Assurances',
          'Grandes entreprises'
        ],
        tags: ['Risques', 'Finance', 'Conformité']
      },
      {
        id: 'fintech-product-manager',
        titre: 'Product Manager Fintech',
        description: 'Développe et gère des produits financiers innovants',
        secteur: 'finance',
        competencesRequises: [
          { nom: 'Product Management', niveau: 'expert' },
          { nom: 'Finance digitale', niveau: 'avancé' },
          { nom: 'UX/UI', niveau: 'avancé' },
          { nom: 'Analyse data', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Master Finance/Tech',
          'MBA',
          'Certifications Produit'
        ],
        perspectives: [
          'CPO',
          'Directeur innovation',
          'Entrepreneur Fintech'
        ],
        environnementTravail: [
          'Fintech',
          'Banques digitales',
          'Startups'
        ],
        tags: ['Fintech', 'Product', 'Innovation']
      }
    ]
  },
  {
    id: 'sante',
    nom: 'Santé & Médical',
    description: 'Les métiers de la santé et du secteur médical',
    icone: '⚕️',
    couleur: '#eb2f96',
    metiers: [
      {
        id: 'medecin-generaliste',
        titre: 'Médecin Généraliste',
        description: 'Assure les soins de santé primaires et le suivi des patients',
        secteur: 'sante',
        competencesRequises: [
          { nom: 'Diagnostic clinique', niveau: 'expert' },
          { nom: 'Relations patients', niveau: 'expert' },
          { nom: 'Connaissances médicales', niveau: 'expert' },
          { nom: 'Gestion cabinet', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1500000 },
          confirme: { min: 1500000, max: 3000000 },
          senior: { min: 3000000, max: 5000000 }
        },
        formation: [
          'Doctorat en Médecine',
          'Internat',
          'Formation continue'
        ],
        perspectives: [
          'Installation en cabinet',
          'Médecin chef',
          'Spécialisation'
        ],
        environnementTravail: [
          'Cabinet privé',
          'Hôpital',
          'Clinique'
        ],
        tags: ['Médecine', 'Soins', 'Santé publique']
      },
      {
        id: 'pharmacien-clinicien',
        titre: 'Pharmacien Clinicien',
        description: 'Assure le suivi thérapeutique et la sécurité des traitements',
        secteur: 'sante',
        competencesRequises: [
          { nom: 'Pharmacologie', niveau: 'expert' },
          { nom: 'Suivi thérapeutique', niveau: 'expert' },
          { nom: 'Pharmacovigilance', niveau: 'avancé' },
          { nom: 'Logiciels santé', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 3500000 }
        },
        formation: [
          'Doctorat en Pharmacie',
          'Spécialisation clinique',
          'Formation continue'
        ],
        perspectives: [
          'Chef de service pharmacie',
          'Directeur pharmacie',
          'Consultant pharmaceutique'
        ],
        environnementTravail: [
          'Hôpitaux',
          'Cliniques',
          'Centres de santé'
        ],
        tags: ['Santé', 'Pharmacie', 'Clinique']
      },
      {
        id: 'infirmier-specialise',
        titre: 'Infirmier Spécialisé',
        description: 'Prodigue des soins spécialisés et assure le suivi des patients',
        secteur: 'sante',
        competencesRequises: [
          { nom: 'Soins infirmiers', niveau: 'expert' },
          { nom: 'Urgences', niveau: 'avancé' },
          { nom: 'Gestion équipe', niveau: 'avancé' },
          { nom: 'Protocoles médicaux', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 2500000 }
        },
        formation: [
          'Diplôme Infirmier',
          'Spécialisation',
          'Formation continue'
        ],
        perspectives: [
          'Cadre de santé',
          'Coordinateur soins',
          'Formateur'
        ],
        environnementTravail: [
          'Hôpitaux',
          'Cliniques privées',
          'Centres spécialisés'
        ],
        tags: ['Santé', 'Soins', 'Médical']
      },
      {
        id: 'chirurgien-specialiste',
        titre: 'Chirurgien Spécialiste',
        description: 'Réalise des interventions chirurgicales spécialisées',
        secteur: 'sante',
        competencesRequises: [
          { nom: 'Chirurgie', niveau: 'expert' },
          { nom: 'Anatomie', niveau: 'expert' },
          { nom: 'Techniques opératoires', niveau: 'expert' },
          { nom: 'Gestion équipe bloc', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 1200000, max: 2400000 },
          confirme: { min: 2400000, max: 4800000 },
          senior: { min: 4800000, max: 8000000 }
        },
        formation: [
          'Doctorat en Médecine',
          'Spécialisation chirurgicale',
          'Formation continue'
        ],
        perspectives: [
          'Chef de service chirurgie',
          'Directeur médical',
          'Professeur de médecine'
        ],
        environnementTravail: [
          'Hôpitaux',
          'Cliniques privées',
          'Centres chirurgicaux'
        ],
        tags: ['Chirurgie', 'Médecine', 'Spécialisation']
      },
      {
        id: 'radiologue',
        titre: 'Radiologue',
        description: 'Réalise et interprète les examens d\'imagerie médicale',
        secteur: 'sante',
        competencesRequises: [
          { nom: 'Imagerie médicale', niveau: 'expert' },
          { nom: 'Diagnostic', niveau: 'expert' },
          { nom: 'Technologies médicales', niveau: 'avancé' },
          { nom: 'IA médicale', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 1000000, max: 2000000 },
          confirme: { min: 2000000, max: 4000000 },
          senior: { min: 4000000, max: 7000000 }
        },
        formation: [
          'Doctorat en Médecine',
          'Spécialisation radiologie',
          'Formation technologies'
        ],
        perspectives: [
          'Chef service radiologie',
          'Directeur imagerie',
          'Expert consultant'
        ],
        environnementTravail: [
          'Centres d\'imagerie',
          'Hôpitaux',
          'Cliniques'
        ],
        tags: ['Radiologie', 'Imagerie', 'Diagnostic']
      },
      {
        id: 'kinesitherapeute',
        titre: 'Kinésithérapeute',
        description: 'Assure la rééducation et la réadaptation fonctionnelle',
        secteur: 'sante',
        competencesRequises: [
          { nom: 'Techniques de rééducation', niveau: 'expert' },
          { nom: 'Anatomie', niveau: 'expert' },
          { nom: 'Biomécanique', niveau: 'avancé' },
          { nom: 'Sport-santé', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 3000000 }
        },
        formation: [
          'Diplôme Kinésithérapie',
          'Spécialisations',
          'Formation continue'
        ],
        perspectives: [
          'Cabinet privé',
          'Coordinateur rééducation',
          'Enseignant'
        ],
        environnementTravail: [
          'Cabinet libéral',
          'Centres rééducation',
          'Clubs sportifs'
        ],
        tags: ['Rééducation', 'Sport', 'Santé']
      }
    ]
  },
  {
    id: 'marketing',
    nom: 'Marketing & Communication',
    description: 'Les métiers du marketing, de la communication et de la publicité',
    icone: '📢',
    couleur: '#722ed1',
    metiers: [
      {
        id: 'digital-marketer',
        titre: 'Digital Marketing Manager',
        description: 'Élabore et met en œuvre la stratégie marketing digital de l\'entreprise',
        secteur: 'marketing',
        competencesRequises: [
          { nom: 'Marketing Digital', niveau: 'expert' },
          { nom: 'Google Analytics', niveau: 'avancé' },
          { nom: 'SEO/SEA', niveau: 'avancé' },
          { nom: 'Réseaux sociaux', niveau: 'expert' },
          { nom: 'Content Marketing', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 350000, max: 700000 },
          confirme: { min: 700000, max: 1400000 },
          senior: { min: 1400000, max: 2500000 }
        },
        formation: [
          'Master en Marketing Digital',
          'École de commerce',
          'Certifications Google'
        ],
        perspectives: [
          'Directeur Marketing',
          'Chef de projet digital',
          'Consultant Marketing'
        ],
        environnementTravail: [
          'Agences digitales',
          'Startups',
          'Grandes entreprises'
        ],
        tags: ['Digital', 'Marketing', 'Communication', 'Web']
      },
      {
        id: 'community-manager',
        titre: 'Community Manager',
        description: 'Gère et anime les communautés sur les réseaux sociaux',
        secteur: 'marketing',
        competencesRequises: [
          { nom: 'Réseaux sociaux', niveau: 'expert' },
          { nom: 'Création de contenu', niveau: 'avancé' },
          { nom: 'Photoshop', niveau: 'intermédiaire' },
          { nom: 'Copywriting', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 200000, max: 400000 },
          confirme: { min: 400000, max: 800000 },
          senior: { min: 800000, max: 1500000 }
        },
        formation: [
          'BTS Communication',
          'Licence Marketing Digital',
          'Certifications réseaux sociaux'
        ],
        perspectives: [
          'Social Media Manager',
          'Digital Brand Manager',
          'Responsable Communication'
        ],
        environnementTravail: [
          'Agences de communication',
          'Freelance',
          'Entreprises'
        ],
        tags: ['Social Media', 'Communication', 'Content']
      }
    ]
  },
  {
    id: 'education',
    nom: 'Éducation & Formation',
    description: 'Les métiers de l\'enseignement et de la formation professionnelle',
    icone: '📚',
    couleur: '#fa8c16',
    metiers: [
      {
        id: 'formateur-pro',
        titre: 'Formateur Professionnel',
        description: 'Conçoit et anime des formations pour adultes dans divers domaines',
        secteur: 'education',
        competencesRequises: [
          { nom: 'Pédagogie', niveau: 'expert' },
          { nom: 'Conception de formation', niveau: 'avancé' },
          { nom: 'Outils e-learning', niveau: 'intermédiaire' },
          { nom: 'Animation de groupe', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 300000, max: 600000 },
          confirme: { min: 600000, max: 1200000 },
          senior: { min: 1200000, max: 2000000 }
        },
        formation: [
          'Master en Sciences de l\'Éducation',
          'Certification de formateur',
          'Expertise métier'
        ],
        perspectives: [
          'Responsable pédagogique',
          'Consultant formation',
          'Directeur centre de formation'
        ],
        environnementTravail: [
          'Centres de formation',
          'Entreprises',
          'Indépendant'
        ],
        tags: ['Formation', 'Pédagogie', 'E-learning']
      },
      {
        id: 'edtech-specialist',
        titre: 'Spécialiste EdTech',
        description: 'Développe et met en œuvre des solutions d\'apprentissage numérique',
        secteur: 'education',
        competencesRequises: [
          { nom: 'LMS', niveau: 'expert' },
          { nom: 'Pédagogie numérique', niveau: 'expert' },
          { nom: 'Production contenus', niveau: 'avancé' },
          { nom: 'Analytics learning', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 2800000 }
        },
        formation: [
          'Master EdTech',
          'Ingénierie pédagogique',
          'Certifications e-learning'
        ],
        perspectives: [
          'Directeur digital learning',
          'Chef de projet EdTech',
          'Consultant e-learning'
        ],
        environnementTravail: [
          'Startups EdTech',
          'Universités',
          'Entreprises formation'
        ],
        tags: ['Education', 'Digital', 'E-learning']
      },
      {
        id: 'conseiller-orientation',
        titre: 'Conseiller en Orientation Numérique',
        description: 'Guide les étudiants dans leur parcours académique et professionnel avec des outils numériques',
        secteur: 'education',
        competencesRequises: [
          { nom: 'Conseil carrière', niveau: 'expert' },
          { nom: 'Outils orientation', niveau: 'avancé' },
          { nom: 'Psychologie', niveau: 'avancé' },
          { nom: 'Digital coaching', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 300000, max: 600000 },
          confirme: { min: 600000, max: 1200000 },
          senior: { min: 1200000, max: 2000000 }
        },
        formation: [
          'Master Orientation',
          'Psychologie',
          'Certification coaching'
        ],
        perspectives: [
          'Directeur orientation',
          'Coach carrière',
          'Consultant éducation'
        ],
        environnementTravail: [
          'Établissements scolaires',
          'Universités',
          'Cabinets conseil'
        ],
        tags: ['Orientation', 'Education', 'Conseil']
      }
    ]
  },
  {
    id: 'construction',
    nom: 'Construction & BTP',
    description: 'Les métiers du bâtiment et des travaux publics',
    icone: '🏗️',
    couleur: '#faad14',
    metiers: [
      {
        id: 'ingenieur-civil',
        titre: 'Ingénieur Génie Civil',
        description: 'Conçoit et supervise les projets de construction et d\'infrastructure',
        secteur: 'construction',
        competencesRequises: [
          { nom: 'Calcul structures', niveau: 'expert' },
          { nom: 'AutoCAD', niveau: 'avancé' },
          { nom: 'Gestion de projet', niveau: 'avancé' },
          { nom: 'Normes construction', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 4000000 }
        },
        formation: [
          'Diplôme d\'ingénieur',
          'Master en Génie Civil',
          'Certifications professionnelles'
        ],
        perspectives: [
          'Chef de projets',
          'Directeur technique',
          'Expert consultant'
        ],
        environnementTravail: [
          'Bureaux d\'études',
          'Entreprises BTP',
          'Cabinets d\'architecture'
        ],
        tags: ['Construction', 'Ingénierie', 'BTP']
      },
      {
        id: 'architecte',
        titre: 'Architecte',
        description: 'Conçoit et suit la réalisation de projets architecturaux',
        secteur: 'construction',
        competencesRequises: [
          { nom: 'Conception architecturale', niveau: 'expert' },
          { nom: 'Logiciels 3D', niveau: 'avancé' },
          { nom: 'Gestion de projet', niveau: 'avancé' },
          { nom: 'Réglementation', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 900000 },
          confirme: { min: 900000, max: 1800000 },
          senior: { min: 1800000, max: 3500000 }
        },
        formation: [
          'Diplôme d\'architecte',
          'DESA',
          'Formations spécialisées'
        ],
        perspectives: [
          'Architecte en chef',
          'Directeur de cabinet',
          'Urbaniste'
        ],
        environnementTravail: [
          'Cabinets d\'architecture',
          'Bureaux d\'études',
          'Indépendant'
        ],
        tags: ['Architecture', 'Design', 'Construction']
      }
    ]
  },
  {
    id: 'tourisme',
    nom: 'Tourisme & Hôtellerie',
    description: 'Les métiers du tourisme, de l\'hôtellerie et de la restauration',
    icone: '🏨',
    couleur: '#13c2c2',
    metiers: [
      {
        id: 'manager-hotel',
        titre: 'Directeur d\'Hôtel',
        description: 'Gère et développe l\'activité d\'un établissement hôtelier',
        secteur: 'tourisme',
        competencesRequises: [
          { nom: 'Gestion hôtelière', niveau: 'expert' },
          { nom: 'Management d\'équipe', niveau: 'expert' },
          { nom: 'Marketing hôtelier', niveau: 'avancé' },
          { nom: 'Relation client', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1500000 },
          confirme: { min: 1500000, max: 2500000 },
          senior: { min: 2500000, max: 4500000 }
        },
        formation: [
          'Master en Management Hôtelier',
          'École hôtelière',
          'MBA Hospitality'
        ],
        perspectives: [
          'Directeur régional',
          'Consultant hôtelier',
          'Propriétaire d\'établissement'
        ],
        environnementTravail: [
          'Hôtels',
          'Resorts',
          'Groupes hôteliers'
        ],
        tags: ['Hôtellerie', 'Management', 'Tourisme']
      }
    ]
  },
  {
    id: 'transport',
    nom: 'Transport & Logistique',
    description: 'Les métiers du transport, de la logistique et de la supply chain',
    icone: '🚛',
    couleur: '#1890ff',
    metiers: [
      {
        id: 'responsable-logistique',
        titre: 'Responsable Logistique',
        description: 'Optimise et gère la chaîne logistique de l\'entreprise',
        secteur: 'transport',
        competencesRequises: [
          { nom: 'Supply Chain', niveau: 'expert' },
          { nom: 'Gestion des stocks', niveau: 'expert' },
          { nom: 'Transport international', niveau: 'avancé' },
          { nom: 'ERP', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 3000000 }
        },
        formation: [
          'Master en Logistique',
          'École de commerce',
          'Certifications logistiques'
        ],
        perspectives: [
          'Directeur Supply Chain',
          'Consultant logistique',
          'Responsable des opérations'
        ],
        environnementTravail: [
          'Entreprises industrielles',
          'Transporteurs',
          'Import-Export'
        ],
        tags: ['Logistique', 'Supply Chain', 'Transport']
      }
    ]
  },
  {
    id: 'environnement',
    nom: 'Environnement & Énergie',
    description: 'Les métiers de l\'environnement, des énergies renouvelables et du développement durable',
    icone: '🌱',
    couleur: '#52c41a',
    metiers: [
      {
        id: 'ingenieur-energie-solaire',
        titre: 'Ingénieur en Énergie Solaire',
        description: 'Conçoit et met en œuvre des solutions d\'énergie solaire',
        secteur: 'environnement',
        competencesRequises: [
          { nom: 'Technologie solaire', niveau: 'expert' },
          { nom: 'Gestion de projet', niveau: 'avancé' },
          { nom: 'Dimensionnement', niveau: 'expert' },
          { nom: 'AutoCAD', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 900000 },
          confirme: { min: 900000, max: 1800000 },
          senior: { min: 1800000, max: 3500000 }
        },
        formation: [
          'Ingénieur énergéticien',
          'Master énergies renouvelables',
          'Certifications techniques'
        ],
        perspectives: [
          'Chef de projets solaires',
          'Consultant en énergie',
          'Directeur technique'
        ],
        environnementTravail: [
          'Entreprises d\'énergie',
          'Bureaux d\'études',
          'ONG'
        ],
        tags: ['Énergie', 'Solaire', 'Environnement']
      },
      {
        id: 'expert-environnement',
        titre: 'Expert Environnemental',
        description: 'Évalue l\'impact environnemental et propose des solutions durables',
        secteur: 'environnement',
        competencesRequises: [
          { nom: 'Études d\'impact', niveau: 'expert' },
          { nom: 'Réglementation', niveau: 'avancé' },
          { nom: 'Gestion de projets', niveau: 'avancé' },
          { nom: 'Outils SIG', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 3000000 }
        },
        formation: [
          'Master en environnement',
          'Ingénieur environnement',
          'Certifications HSE'
        ],
        perspectives: [
          'Directeur HSE',
          'Consultant environnement',
          'Chef de projets durables'
        ],
        environnementTravail: [
          'Bureaux d\'études',
          'Industries',
          'Organisations internationales'
        ],
        tags: ['Environnement', 'Développement durable', 'HSE']
      },
      {
        id: 'expert-eolien',
        titre: 'Expert en Énergie Éolienne',
        description: 'Développe et gère des projets d\'énergie éolienne',
        secteur: 'environnement',
        competencesRequises: [
          { nom: 'Technologie éolienne', niveau: 'expert' },
          { nom: 'Gestion projet', niveau: 'avancé' },
          { nom: 'Études impact', niveau: 'avancé' },
          { nom: 'Maintenance éolienne', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Ingénieur énergies',
          'Master éolien',
          'Certifications techniques'
        ],
        perspectives: [
          'Chef projet éolien',
          'Directeur technique',
          'Consultant énergie'
        ],
        environnementTravail: [
          'Parcs éoliens',
          'Bureaux études',
          'Entreprises énergie'
        ],
        tags: ['Énergie', 'Éolien', 'Environnement']
      },
      {
        id: 'expert-economie-circulaire',
        titre: 'Expert en Économie Circulaire',
        description: 'Développe des solutions pour optimiser l\'utilisation des ressources',
        secteur: 'environnement',
        competencesRequises: [
          { nom: 'Économie circulaire', niveau: 'expert' },
          { nom: 'Gestion déchets', niveau: 'avancé' },
          { nom: 'Analyse cycle vie', niveau: 'expert' },
          { nom: 'RSE', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 450000, max: 900000 },
          confirme: { min: 900000, max: 1800000 },
          senior: { min: 1800000, max: 3000000 }
        },
        formation: [
          'Master Environnement',
          'Spécialisation économie circulaire',
          'Certifications RSE'
        ],
        perspectives: [
          'Directeur développement durable',
          'Consultant environnement',
          'Chef projet RSE'
        ],
        environnementTravail: [
          'Entreprises industrielles',
          'Cabinets conseil',
          'Collectivités'
        ],
        tags: ['Environnement', 'Économie circulaire', 'RSE']
      }
    ]
  },
  {
    id: 'agriculture',
    nom: 'Agriculture & Agroalimentaire',
    description: 'Les métiers de l\'agriculture moderne et de l\'industrie agroalimentaire',
    icone: '🌾',
    couleur: '#a0d911',
    metiers: [
      {
        id: 'agronome',
        titre: 'Ingénieur Agronome',
        description: 'Développe et optimise les productions agricoles',
        secteur: 'agriculture',
        competencesRequises: [
          { nom: 'Agronomie', niveau: 'expert' },
          { nom: 'Agriculture durable', niveau: 'avancé' },
          { nom: 'Gestion de projet', niveau: 'avancé' },
          { nom: 'Biotechnologies', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1500000 },
          senior: { min: 1500000, max: 2800000 }
        },
        formation: [
          'Ingénieur agronome',
          'Master en agronomie',
          'Spécialisation agriculture'
        ],
        perspectives: [
          'Directeur exploitation',
          'Consultant agricole',
          'Chef de projets agricoles'
        ],
        environnementTravail: [
          'Exploitations agricoles',
          'Organisations agricoles',
          'Centres de recherche'
        ],
        tags: ['Agriculture', 'Agronomie', 'Production']
      },
      {
        id: 'qualite-agroalimentaire',
        titre: 'Responsable Qualité Agroalimentaire',
        description: 'Assure la qualité et la sécurité des produits alimentaires',
        secteur: 'agriculture',
        competencesRequises: [
          { nom: 'Normes HACCP', niveau: 'expert' },
          { nom: 'Sécurité alimentaire', niveau: 'expert' },
          { nom: 'Gestion qualité', niveau: 'avancé' },
          { nom: 'Audit qualité', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 450000, max: 900000 },
          confirme: { min: 900000, max: 1700000 },
          senior: { min: 1700000, max: 3000000 }
        },
        formation: [
          'Master agroalimentaire',
          'Ingénieur qualité',
          'Certifications HACCP'
        ],
        perspectives: [
          'Directeur qualité',
          'Auditeur qualité',
          'Consultant agroalimentaire'
        ],
        environnementTravail: [
          'Industries agroalimentaires',
          'Laboratoires',
          'Organismes de certification'
        ],
        tags: ['Qualité', 'Agroalimentaire', 'HACCP']
      },
      {
        id: 'agritech-specialist',
        titre: 'Spécialiste AgriTech',
        description: 'Développe et implémente des solutions technologiques pour l\'agriculture',
        secteur: 'agriculture',
        competencesRequises: [
          { nom: 'Agriculture digitale', niveau: 'expert' },
          { nom: 'IoT agricole', niveau: 'avancé' },
          { nom: 'Data farming', niveau: 'avancé' },
          { nom: 'Systèmes irrigation', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Ingénieur AgriTech',
          'Master Agriculture',
          'Certifications tech'
        ],
        perspectives: [
          'Directeur innovation',
          'Chef projet AgriTech',
          'Consultant agriculture'
        ],
        environnementTravail: [
          'Startups AgriTech',
          'Exploitations modernes',
          'Centres recherche'
        ],
        tags: ['Agriculture', 'Innovation', 'Technologie']
      },
      {
        id: 'expert-aquaculture',
        titre: 'Expert en Aquaculture',
        description: 'Gère et optimise la production aquacole',
        secteur: 'agriculture',
        competencesRequises: [
          { nom: 'Aquaculture', niveau: 'expert' },
          { nom: 'Biologie marine', niveau: 'avancé' },
          { nom: 'Gestion production', niveau: 'expert' },
          { nom: 'Qualité eau', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 2800000 }
        },
        formation: [
          'Master Aquaculture',
          'Ingénieur agronome',
          'Spécialisation marine'
        ],
        perspectives: [
          'Directeur production',
          'Consultant aquacole',
          'Chef exploitation'
        ],
        environnementTravail: [
          'Fermes aquacoles',
          'Centres recherche',
          'Entreprises pêche'
        ],
        tags: ['Aquaculture', 'Agriculture', 'Production']
      }
    ]
  },
  {
    id: 'medias',
    nom: 'Médias & Communication',
    description: 'Les métiers des médias, du journalisme et de la production audiovisuelle',
    icone: '📺',
    couleur: '#f759ab',
    metiers: [
      {
        id: 'journaliste',
        titre: 'Journaliste',
        description: 'Collecte, vérifie et diffuse l\'information sur différents supports médiatiques',
        secteur: 'medias',
        competencesRequises: [
          { nom: 'Rédaction', niveau: 'expert' },
          { nom: 'Investigation', niveau: 'avancé' },
          { nom: 'Fact-checking', niveau: 'expert' },
          { nom: 'Outils numériques', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 300000, max: 600000 },
          confirme: { min: 600000, max: 1200000 },
          senior: { min: 1200000, max: 2500000 }
        },
        formation: [
          'Master en Journalisme',
          'École de journalisme',
          'Formation continue'
        ],
        perspectives: [
          'Rédacteur en chef',
          'Grand reporter',
          'Journaliste spécialisé'
        ],
        environnementTravail: [
          'Presse écrite',
          'Télévision',
          'Médias en ligne'
        ],
        tags: ['Médias', 'Information', 'Presse']
      },
      {
        id: 'producteur-audiovisuel',
        titre: 'Producteur Audiovisuel',
        description: 'Gère la production de contenus audiovisuels et coordonne les équipes',
        secteur: 'medias',
        competencesRequises: [
          { nom: 'Gestion de production', niveau: 'expert' },
          { nom: 'Budgétisation', niveau: 'avancé' },
          { nom: 'Direction artistique', niveau: 'avancé' },
          { nom: 'Droit audiovisuel', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 4000000 }
        },
        formation: [
          'Master Production Audiovisuelle',
          'École de cinéma',
          'Formation technique'
        ],
        perspectives: [
          'Directeur de production',
          'Producteur exécutif',
          'Créateur de contenus'
        ],
        environnementTravail: [
          'Sociétés de production',
          'Chaînes TV',
          'Studios'
        ],
        tags: ['Audiovisuel', 'Production', 'Médias']
      }
    ]
  },
  {
    id: 'artisanat',
    nom: 'Artisanat & Métiers d\'art',
    description: 'Les métiers de l\'artisanat traditionnel et contemporain',
    icone: '🎨',
    couleur: '#9254de',
    metiers: [
      {
        id: 'artisan-bijoutier',
        titre: 'Artisan Bijoutier',
        description: 'Crée et restaure des bijoux en métaux précieux et pierres',
        secteur: 'artisanat',
        competencesRequises: [
          { nom: 'Travail des métaux', niveau: 'expert' },
          { nom: 'Design bijoux', niveau: 'avancé' },
          { nom: 'Gemmologie', niveau: 'intermédiaire' },
          { nom: 'Techniques traditionnelles', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 200000, max: 400000 },
          confirme: { min: 400000, max: 800000 },
          senior: { min: 800000, max: 2000000 }
        },
        formation: [
          'CAP Bijouterie',
          'Formation professionnelle',
          'Apprentissage'
        ],
        perspectives: [
          'Artisan indépendant',
          'Chef d\'atelier',
          'Formateur'
        ],
        environnementTravail: [
          'Ateliers',
          'Boutiques',
          'Marchés artisanaux'
        ],
        tags: ['Artisanat', 'Bijouterie', 'Création']
      },
      {
        id: 'tisserand',
        titre: 'Maître Tisserand',
        description: 'Crée des textiles traditionnels et contemporains',
        secteur: 'artisanat',
        competencesRequises: [
          { nom: 'Techniques de tissage', niveau: 'expert' },
          { nom: 'Design textile', niveau: 'avancé' },
          { nom: 'Teinture naturelle', niveau: 'avancé' },
          { nom: 'Gestion atelier', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 150000, max: 300000 },
          confirme: { min: 300000, max: 600000 },
          senior: { min: 600000, max: 1500000 }
        },
        formation: [
          'Formation traditionnelle',
          'Centre artisanal',
          'Apprentissage'
        ],
        perspectives: [
          'Artisan indépendant',
          'Formateur',
          'Entrepreneur textile'
        ],
        environnementTravail: [
          'Ateliers traditionnels',
          'Coopératives',
          'Centres artisanaux'
        ],
        tags: ['Artisanat', 'Textile', 'Tradition']
      }
    ]
  },
  {
    id: 'industrie',
    nom: 'Industrie & Manufacturing',
    description: 'Les métiers de l\'industrie et de la production manufacturière',
    icone: '🏭',
    couleur: '#597ef7',
    metiers: [
      {
        id: 'ingenieur-production',
        titre: 'Ingénieur de Production',
        description: 'Optimise et supervise les processus de production industrielle',
        secteur: 'industrie',
        competencesRequises: [
          { nom: 'Gestion de production', niveau: 'expert' },
          { nom: 'Lean Manufacturing', niveau: 'avancé' },
          { nom: 'Qualité industrielle', niveau: 'avancé' },
          { nom: 'Management équipe', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Ingénieur industriel',
          'Master Production',
          'Certifications Lean'
        ],
        perspectives: [
          'Directeur de production',
          'Responsable d\'usine',
          'Consultant industriel'
        ],
        environnementTravail: [
          'Usines',
          'Sites industriels',
          'Bureaux d\'études'
        ],
        tags: ['Industrie', 'Production', 'Manufacturing']
      },
      {
        id: 'technicien-maintenance',
        titre: 'Technicien de Maintenance Industrielle',
        description: 'Assure la maintenance préventive et corrective des équipements industriels',
        secteur: 'industrie',
        competencesRequises: [
          { nom: 'Mécanique industrielle', niveau: 'expert' },
          { nom: 'Électrotechnique', niveau: 'avancé' },
          { nom: 'Automatismes', niveau: 'avancé' },
          { nom: 'GMAO', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 300000, max: 600000 },
          confirme: { min: 600000, max: 1200000 },
          senior: { min: 1200000, max: 2000000 }
        },
        formation: [
          'BTS Maintenance',
          'DUT Génie industriel',
          'Formation continue'
        ],
        perspectives: [
          'Responsable maintenance',
          'Chef d\'équipe',
          'Technicien spécialisé'
        ],
        environnementTravail: [
          'Industries',
          'Usines',
          'Services techniques'
        ],
        tags: ['Maintenance', 'Industrie', 'Technique']
      }
    ]
  },
  {
    id: 'commerce',
    nom: 'Commerce & Distribution',
    description: 'Les métiers du commerce, de la vente et de la grande distribution',
    icone: '🏪',
    couleur: '#36cfc9',
    metiers: [
      {
        id: 'category-manager',
        titre: 'Category Manager',
        description: 'Gère et optimise une catégorie de produits pour maximiser les ventes',
        secteur: 'commerce',
        competencesRequises: [
          { nom: 'Analyse commerciale', niveau: 'expert' },
          { nom: 'Marketing', niveau: 'avancé' },
          { nom: 'Négociation', niveau: 'avancé' },
          { nom: 'Merchandising', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1500000 },
          senior: { min: 1500000, max: 2500000 }
        },
        formation: [
          'Master Commerce/Marketing',
          'École de commerce',
          'Formation retail'
        ],
        perspectives: [
          'Directeur commercial',
          'Chef de produit',
          'Directeur des achats'
        ],
        environnementTravail: [
          'Grande distribution',
          'Centrales d\'achat',
          'Retail'
        ],
        tags: ['Commerce', 'Marketing', 'Distribution']
      },
      {
        id: 'responsable-magasin',
        titre: 'Responsable de Magasin',
        description: 'Gère et développe l\'activité d\'un point de vente',
        secteur: 'commerce',
        competencesRequises: [
          { nom: 'Management équipe', niveau: 'expert' },
          { nom: 'Gestion commerciale', niveau: 'expert' },
          { nom: 'Service client', niveau: 'avancé' },
          { nom: 'Gestion stocks', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 350000, max: 700000 },
          confirme: { min: 700000, max: 1400000 },
          senior: { min: 1400000, max: 2200000 }
        },
        formation: [
          'BTS Management Commercial',
          'Licence Pro Commerce',
          'Formation continue'
        ],
        perspectives: [
          'Directeur régional',
          'Responsable réseau',
          'Consultant retail'
        ],
        environnementTravail: [
          'Points de vente',
          'Centres commerciaux',
          'Boutiques'
        ],
        tags: ['Retail', 'Management', 'Commerce']
      }
    ]
  },
  {
    id: 'juridique',
    nom: 'Droit & Justice',
    description: 'Les métiers du droit, de la justice et du conseil juridique',
    icone: '⚖️',
    couleur: '#ffc53d',
    metiers: [
      {
        id: 'avocat-affaires',
        titre: 'Avocat d\'Affaires',
        description: 'Conseille et défend les entreprises sur les aspects juridiques',
        secteur: 'juridique',
        competencesRequises: [
          { nom: 'Droit des affaires', niveau: 'expert' },
          { nom: 'Négociation', niveau: 'avancé' },
          { nom: 'Anglais juridique', niveau: 'avancé' },
          { nom: 'Rédaction juridique', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1500000 },
          confirme: { min: 1500000, max: 3000000 },
          senior: { min: 3000000, max: 5000000 }
        },
        formation: [
          'Master en Droit',
          'CAPA',
          'Spécialisation Droit des affaires'
        ],
        perspectives: [
          'Associé cabinet',
          'Juriste d\'entreprise',
          'Consultant juridique'
        ],
        environnementTravail: [
          'Cabinets d\'avocats',
          'Entreprises',
          'Banques'
        ],
        tags: ['Droit', 'Conseil', 'Juridique']
      },
      {
        id: 'juriste-entreprise',
        titre: 'Juriste d\'Entreprise',
        description: 'Assure la sécurité juridique de l\'entreprise',
        secteur: 'juridique',
        competencesRequises: [
          { nom: 'Droit des sociétés', niveau: 'expert' },
          { nom: 'Droit des contrats', niveau: 'expert' },
          { nom: 'Droit social', niveau: 'avancé' },
          { nom: 'Compliance', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Master en Droit',
          'DJCE',
          'Formation continue'
        ],
        perspectives: [
          'Directeur juridique',
          'Responsable conformité',
          'Secrétaire général'
        ],
        environnementTravail: [
          'Grandes entreprises',
          'Banques',
          'Assurances'
        ],
        tags: ['Juridique', 'Entreprise', 'Droit']
      }
    ]
  },
  {
    id: 'immobilier',
    nom: 'Immobilier & Construction',
    description: 'Les métiers de l\'immobilier, de la promotion et de la gestion immobilière',
    icone: '🏢',
    couleur: '#ff7a45',
    metiers: [
      {
        id: 'agent-immobilier',
        titre: 'Agent Immobilier',
        description: 'Conseille et accompagne les clients dans leurs projets immobiliers',
        secteur: 'immobilier',
        competencesRequises: [
          { nom: 'Négociation', niveau: 'expert' },
          { nom: 'Droit immobilier', niveau: 'avancé' },
          { nom: 'Marketing immobilier', niveau: 'avancé' },
          { nom: 'Estimation', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 300000, max: 800000 },
          confirme: { min: 800000, max: 2000000 },
          senior: { min: 2000000, max: 4000000 }
        },
        formation: [
          'BTS Immobilier',
          'Licence pro immobilier',
          'Carte professionnelle'
        ],
        perspectives: [
          'Directeur agence',
          'Négociateur senior',
          'Entrepreneur immobilier'
        ],
        environnementTravail: [
          'Agences immobilières',
          'Promoteurs',
          'Indépendant'
        ],
        tags: ['Immobilier', 'Vente', 'Négociation']
      },
      {
        id: 'promoteur-immobilier',
        titre: 'Promoteur Immobilier',
        description: 'Développe et pilote des projets immobiliers',
        secteur: 'immobilier',
        competencesRequises: [
          { nom: 'Gestion de projet', niveau: 'expert' },
          { nom: 'Finance immobilière', niveau: 'expert' },
          { nom: 'Droit construction', niveau: 'avancé' },
          { nom: 'Management', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1600000 },
          confirme: { min: 1600000, max: 3200000 },
          senior: { min: 3200000, max: 6000000 }
        },
        formation: [
          'Master Immobilier',
          'École de commerce',
          'Formation juridique'
        ],
        perspectives: [
          'Directeur promotion',
          'Développeur immobilier',
          'Investisseur'
        ],
        environnementTravail: [
          'Sociétés promotion',
          'Groupes immobiliers',
          'Entreprise personnelle'
        ],
        tags: ['Promotion', 'Construction', 'Immobilier']
      },
      {
        id: 'architecte',
        titre: 'Architecte',
        description: 'Conçoit et supervise les projets de construction',
        secteur: 'immobilier',
        competencesRequises: [
          { nom: 'Architecture', niveau: 'expert' },
          { nom: 'CAO/DAO', niveau: 'expert' },
          { nom: 'Gestion projet', niveau: 'avancé' },
          { nom: 'Réglementation', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4500000 }
        },
        formation: [
          'Diplôme Architecte',
          'HMONP',
          'Formation continue'
        ],
        perspectives: [
          'Architecte associé',
          'Urbaniste',
          'Expert conseil'
        ],
        environnementTravail: [
          'Cabinet architecture',
          'Bureaux études',
          'Collectivités'
        ],
        tags: ['Architecture', 'Construction', 'Design']
      },
      {
        id: 'gestionnaire-patrimoine',
        titre: 'Gestionnaire de Patrimoine Immobilier',
        description: 'Gère et optimise les actifs immobiliers',
        secteur: 'immobilier',
        competencesRequises: [
          { nom: 'Gestion immobilière', niveau: 'expert' },
          { nom: 'Finance', niveau: 'avancé' },
          { nom: 'Droit immobilier', niveau: 'avancé' },
          { nom: 'Asset management', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 4000000 }
        },
        formation: [
          'Master Gestion Patrimoine',
          'École immobilier',
          'Certifications'
        ],
        perspectives: [
          'Directeur patrimoine',
          'Asset manager',
          'Consultant'
        ],
        environnementTravail: [
          'Foncières',
          'Banques privées',
          'Cabinets conseil'
        ],
        tags: ['Patrimoine', 'Gestion', 'Immobilier']
      },
      {
        id: 'expert-immobilier',
        titre: 'Expert Immobilier',
        description: 'Évalue et expertise les biens immobiliers',
        secteur: 'immobilier',
        competencesRequises: [
          { nom: 'Expertise immobilière', niveau: 'expert' },
          { nom: 'Évaluation', niveau: 'expert' },
          { nom: 'Droit immobilier', niveau: 'avancé' },
          { nom: 'Analyse marché', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 3000000 }
        },
        formation: [
          'Master Expertise Immobilière',
          'Certifications',
          'Formation continue'
        ],
        perspectives: [
          'Expert judiciaire',
          'Directeur expertise',
          'Consultant senior'
        ],
        environnementTravail: [
          'Cabinets expertise',
          'Banques',
          'Tribunaux'
        ],
        tags: ['Expertise', 'Évaluation', 'Immobilier']
      }
    ]
  },
  {
    id: 'sport',
    nom: 'Sport & Loisirs',
    description: 'Les métiers du sport, des loisirs et du bien-être',
    icone: '⚽',
    couleur: '#73d13d',
    metiers: [
      {
        id: 'coach-sportif',
        titre: 'Coach Sportif Professionnel',
        description: 'Accompagne les particuliers et sportifs dans leur préparation physique',
        secteur: 'sport',
        competencesRequises: [
          { nom: 'Techniques sportives', niveau: 'expert' },
          { nom: 'Anatomie', niveau: 'avancé' },
          { nom: 'Nutrition sportive', niveau: 'avancé' },
          { nom: 'Premiers secours', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 250000, max: 500000 },
          confirme: { min: 500000, max: 1000000 },
          senior: { min: 1000000, max: 2000000 }
        },
        formation: [
          'BPJEPS',
          'Licence STAPS',
          'Certifications spécialisées'
        ],
        perspectives: [
          'Préparateur physique',
          'Directeur sportif',
          'Entrepreneur fitness'
        ],
        environnementTravail: [
          'Salles de sport',
          'Clubs sportifs',
          'Coaching privé'
        ],
        tags: ['Sport', 'Coaching', 'Bien-être']
      },
      {
        id: 'gestionnaire-installations',
        titre: 'Gestionnaire d\'Installations Sportives',
        description: 'Gère et développe des infrastructures sportives',
        secteur: 'sport',
        competencesRequises: [
          { nom: 'Gestion équipements', niveau: 'expert' },
          { nom: 'Management équipe', niveau: 'avancé' },
          { nom: 'Sécurité', niveau: 'expert' },
          { nom: 'Événementiel', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1500000 },
          senior: { min: 1500000, max: 2500000 }
        },
        formation: [
          'Master Management du Sport',
          'Licence Gestion',
          'Formation sécurité'
        ],
        perspectives: [
          'Directeur complexe sportif',
          'Responsable événementiel',
          'Consultant sport'
        ],
        environnementTravail: [
          'Complexes sportifs',
          'Collectivités',
          'Clubs professionnels'
        ],
        tags: ['Sport', 'Management', 'Équipements']
      }
    ]
  },
  {
    id: 'rh',
    nom: 'Ressources Humaines',
    description: 'Les métiers des ressources humaines et du développement des talents',
    icone: '👥',
    couleur: '#ffa39e',
    metiers: [
      {
        id: 'talent-manager',
        titre: 'Talent Manager',
        description: 'Recrute et développe les talents au sein de l\'entreprise',
        secteur: 'rh',
        competencesRequises: [
          { nom: 'Recrutement', niveau: 'expert' },
          { nom: 'Développement RH', niveau: 'avancé' },
          { nom: 'Assessment', niveau: 'avancé' },
          { nom: 'SIRH', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 450000, max: 900000 },
          confirme: { min: 900000, max: 1800000 },
          senior: { min: 1800000, max: 3000000 }
        },
        formation: [
          'Master RH',
          'École de commerce',
          'Certifications RH'
        ],
        perspectives: [
          'DRH',
          'Responsable développement RH',
          'Consultant RH'
        ],
        environnementTravail: [
          'Grandes entreprises',
          'Cabinets recrutement',
          'Startups'
        ],
        tags: ['RH', 'Recrutement', 'Talents']
      },
      {
        id: 'formation-pro',
        titre: 'Responsable Formation',
        description: 'Élabore et pilote la stratégie de formation de l\'entreprise',
        secteur: 'rh',
        competencesRequises: [
          { nom: 'Ingénierie formation', niveau: 'expert' },
          { nom: 'Gestion budgets', niveau: 'avancé' },
          { nom: 'Digital learning', niveau: 'avancé' },
          { nom: 'Pédagogie', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 2800000 }
        },
        formation: [
          'Master Formation',
          'Sciences de l\'éducation',
          'Certifications pédagogiques'
        ],
        perspectives: [
          'Directeur formation',
          'Consultant formation',
          'Learning manager'
        ],
        environnementTravail: [
          'Entreprises',
          'Organismes formation',
          'Cabinets conseil'
        ],
        tags: ['Formation', 'RH', 'Pédagogie']
      }
    ]
  },
  {
    id: 'recherche',
    nom: 'Recherche & Innovation',
    description: 'Les métiers de la recherche scientifique et de l\'innovation',
    icone: '🔬',
    couleur: '#69c0ff',
    metiers: [
      {
        id: 'chercheur',
        titre: 'Chercheur en Biotechnologie',
        description: 'Mène des recherches en biotechnologie et développe des innovations',
        secteur: 'recherche',
        competencesRequises: [
          { nom: 'Biotechnologies', niveau: 'expert' },
          { nom: 'Méthodologie recherche', niveau: 'expert' },
          { nom: 'Analyse données', niveau: 'avancé' },
          { nom: 'Rédaction scientifique', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Doctorat Biotechnologie',
          'Post-doctorat',
          'Publications scientifiques'
        ],
        perspectives: [
          'Directeur recherche',
          'Chef de laboratoire',
          'Expert consultant'
        ],
        environnementTravail: [
          'Centres recherche',
          'Laboratoires',
          'Universités'
        ],
        tags: ['Recherche', 'Science', 'Innovation']
      },
      {
        id: 'innovation-manager',
        titre: 'Innovation Manager',
        description: 'Pilote la stratégie d\'innovation de l\'entreprise',
        secteur: 'recherche',
        competencesRequises: [
          { nom: 'Gestion innovation', niveau: 'expert' },
          { nom: 'Design thinking', niveau: 'avancé' },
          { nom: 'Gestion projets R&D', niveau: 'expert' },
          { nom: 'Veille technologique', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Master Innovation',
          'École d\'ingénieur',
          'MBA Innovation'
        ],
        perspectives: [
          'Directeur innovation',
          'Chief Digital Officer',
          'Consultant innovation'
        ],
        environnementTravail: [
          'Startups',
          'R&D entreprises',
          'Incubateurs'
        ],
        tags: ['Innovation', 'R&D', 'Technologie']
      }
    ]
  },
  {
    id: 'mode',
    nom: 'Mode & Luxe',
    description: 'Les métiers de la mode, du luxe et de la création',
    icone: '👗',
    couleur: '#ff85c0',
    metiers: [
      {
        id: 'styliste',
        titre: 'Styliste-Modéliste',
        description: 'Crée et conçoit des collections de vêtements',
        secteur: 'mode',
        competencesRequises: [
          { nom: 'Design mode', niveau: 'expert' },
          { nom: 'Modélisme', niveau: 'expert' },
          { nom: 'Illustration', niveau: 'avancé' },
          { nom: 'Logiciels CAO', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 300000, max: 600000 },
          confirme: { min: 600000, max: 1200000 },
          senior: { min: 1200000, max: 2500000 }
        },
        formation: [
          'École de mode',
          'BTS Mode',
          'Formation design'
        ],
        perspectives: [
          'Directeur artistique',
          'Chef de collection',
          'Créateur indépendant'
        ],
        environnementTravail: [
          'Maisons de mode',
          'Ateliers',
          'Freelance'
        ],
        tags: ['Mode', 'Design', 'Création']
      },
      {
        id: 'retail-manager-luxe',
        titre: 'Retail Manager Luxe',
        description: 'Gère et développe des boutiques de luxe',
        secteur: 'mode',
        competencesRequises: [
          { nom: 'Management luxe', niveau: 'expert' },
          { nom: 'Vente haut de gamme', niveau: 'expert' },
          { nom: 'Merchandising', niveau: 'avancé' },
          { nom: 'CRM', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Master Luxe',
          'École commerce',
          'Formation retail'
        ],
        perspectives: [
          'Directeur boutique',
          'Area manager',
          'Consultant luxe'
        ],
        environnementTravail: [
          'Boutiques luxe',
          'Grands magasins',
          'Maisons de luxe'
        ],
        tags: ['Luxe', 'Retail', 'Management']
      }
    ]
  },
  {
    id: 'telecom',
    nom: 'Télécommunications',
    description: 'Les métiers des télécommunications et des réseaux',
    icone: '📡',
    couleur: '#40a9ff',
    metiers: [
      {
        id: 'ingenieur-telecom',
        titre: 'Ingénieur Télécoms',
        description: 'Conçoit et déploie les infrastructures de télécommunications',
        secteur: 'telecom',
        competencesRequises: [
          { nom: 'Réseaux mobiles', niveau: 'expert' },
          { nom: 'Fibre optique', niveau: 'avancé' },
          { nom: '5G/6G', niveau: 'avancé' },
          { nom: 'IoT', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Ingénieur Télécoms',
          'Master Réseaux',
          'Certifications techniques'
        ],
        perspectives: [
          'Architecte réseau',
          'Chef de projet',
          'Expert télécoms'
        ],
        environnementTravail: [
          'Opérateurs télécoms',
          'Équipementiers',
          'ESN'
        ],
        tags: ['Télécoms', 'Réseaux', 'Infrastructure']
      },
      {
        id: 'expert-iot',
        titre: 'Expert IoT',
        description: 'Développe des solutions connectées pour l\'industrie et les services',
        secteur: 'telecom',
        competencesRequises: [
          { nom: 'IoT', niveau: 'expert' },
          { nom: 'Protocoles sans fil', niveau: 'expert' },
          { nom: 'Sécurité IoT', niveau: 'avancé' },
          { nom: 'Edge Computing', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Ingénieur IoT',
          'Master Objets Connectés',
          'Certifications'
        ],
        perspectives: [
          'Architecte IoT',
          'Directeur innovation',
          'Consultant IoT'
        ],
        environnementTravail: [
          'Startups IoT',
          'Industriels',
          'Opérateurs'
        ],
        tags: ['IoT', 'Innovation', 'Connectivité']
      }
    ]
  },
  {
    id: 'sante-tech',
    nom: 'Santé & Technologies',
    description: 'Les métiers à l\'intersection de la santé et des nouvelles technologies',
    icone: '🏥',
    couleur: '#f759ab',
    metiers: [
      {
        id: 'ingenieur-biomedical',
        titre: 'Ingénieur Biomédical',
        description: 'Développe des solutions technologiques pour la santé',
        secteur: 'sante-tech',
        competencesRequises: [
          { nom: 'Ingénierie biomédicale', niveau: 'expert' },
          { nom: 'Dispositifs médicaux', niveau: 'avancé' },
          { nom: 'Réglementation santé', niveau: 'avancé' },
          { nom: 'R&D médical', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Ingénieur biomédical',
          'Master santé',
          'Doctorat'
        ],
        perspectives: [
          'Directeur R&D',
          'Chef de projet innovation',
          'Expert médical'
        ],
        environnementTravail: [
          'Industrie médicale',
          'Startups santé',
          'Centres recherche'
        ],
        tags: ['Santé', 'Innovation', 'Médical']
      },
      {
        id: 'data-scientist-sante',
        titre: 'Data Scientist Santé',
        description: 'Analyse les données de santé pour améliorer les soins et la recherche',
        secteur: 'sante-tech',
        competencesRequises: [
          { nom: 'Data Science', niveau: 'expert' },
          { nom: 'IA médicale', niveau: 'avancé' },
          { nom: 'Statistiques', niveau: 'expert' },
          { nom: 'Données médicales', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1400000 },
          confirme: { min: 1400000, max: 2800000 },
          senior: { min: 2800000, max: 4500000 }
        },
        formation: [
          'Master Data Science',
          'Spécialisation santé',
          'Doctorat'
        ],
        perspectives: [
          'Lead Data Scientist',
          'Directeur données santé',
          'Chercheur IA santé'
        ],
        environnementTravail: [
          'Hôpitaux',
          'Laboratoires',
          'Startups e-santé'
        ],
        tags: ['Data', 'Santé', 'IA']
      }
    ]
  },
  {
    id: 'commerce-digital',
    nom: 'Commerce Digital',
    description: 'Les métiers du e-commerce et du commerce connecté',
    icone: '🛍️',
    couleur: '#40a9ff',
    metiers: [
      {
        id: 'ecommerce-manager',
        titre: 'E-commerce Manager',
        description: 'Gère et développe l\'activité de vente en ligne',
        secteur: 'commerce-digital',
        competencesRequises: [
          { nom: 'Plateformes e-commerce', niveau: 'expert' },
          { nom: 'Marketing digital', niveau: 'avancé' },
          { nom: 'Analytics', niveau: 'avancé' },
          { nom: 'UX/UI', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 3000000 }
        },
        formation: [
          'Master E-commerce',
          'École de commerce',
          'Certifications digitales'
        ],
        perspectives: [
          'Directeur e-commerce',
          'Chief Digital Officer',
          'Consultant digital'
        ],
        environnementTravail: [
          'Pure players',
          'Retail',
          'Marketplaces'
        ],
        tags: ['E-commerce', 'Digital', 'Retail']
      },
      {
        id: 'growth-hacker',
        titre: 'Growth Hacker',
        description: 'Optimise la croissance des plateformes digitales',
        secteur: 'commerce-digital',
        competencesRequises: [
          { nom: 'Growth Hacking', niveau: 'expert' },
          { nom: 'Data Analysis', niveau: 'avancé' },
          { nom: 'Marketing automation', niveau: 'expert' },
          { nom: 'Scripting', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 450000, max: 900000 },
          confirme: { min: 900000, max: 1800000 },
          senior: { min: 1800000, max: 3200000 }
        },
        formation: [
          'Marketing Digital',
          'Growth Marketing',
          'Data Analytics'
        ],
        perspectives: [
          'Head of Growth',
          'CMO',
          'Entrepreneur'
        ],
        environnementTravail: [
          'Startups',
          'Scale-ups',
          'Agences digitales'
        ],
        tags: ['Growth', 'Marketing', 'Data']
      }
    ]
  },
  {
    id: 'industries-creatives',
    nom: 'Industries Créatives',
    description: 'Les métiers de la création numérique et du divertissement',
    icone: '🎨',
    couleur: '#f759ab',
    metiers: [
      {
        id: 'motion-designer',
        titre: 'Motion Designer',
        description: 'Crée des animations et contenus visuels dynamiques',
        secteur: 'industries-creatives',
        competencesRequises: [
          { nom: 'After Effects', niveau: 'expert' },
          { nom: 'Cinema 4D', niveau: 'avancé' },
          { nom: 'Design graphique', niveau: 'expert' },
          { nom: 'Animation', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 350000, max: 700000 },
          confirme: { min: 700000, max: 1400000 },
          senior: { min: 1400000, max: 2500000 }
        },
        formation: [
          'École d\'animation',
          'Formation design',
          'Certifications Adobe'
        ],
        perspectives: [
          'Directeur artistique',
          'Lead Motion Designer',
          'Entrepreneur créatif'
        ],
        environnementTravail: [
          'Studios création',
          'Agences pub',
          'Freelance'
        ],
        tags: ['Animation', 'Design', 'Création']
      },
      {
        id: 'game-developer',
        titre: 'Développeur de Jeux',
        description: 'Crée et développe des jeux vidéo',
        secteur: 'industries-creatives',
        competencesRequises: [
          { nom: 'Unity/Unreal', niveau: 'expert' },
          { nom: 'C++/C#', niveau: 'expert' },
          { nom: 'Game Design', niveau: 'avancé' },
          { nom: '3D/2D', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 3000000 }
        },
        formation: [
          'École jeux vidéo',
          'Informatique',
          'Game design'
        ],
        perspectives: [
          'Lead Developer',
          'Game Director',
          'Studio Owner'
        ],
        environnementTravail: [
          'Studios jeux',
          'Startups gaming',
          'Freelance'
        ],
        tags: ['Gaming', 'Développement', 'Création']
      }
    ]
  },
  {
    id: 'transport-durable',
    nom: 'Transport Durable',
    description: 'Les métiers du transport écologique et de la mobilité durable',
    icone: '🚲',
    couleur: '#73d13d',
    metiers: [
      {
        id: 'expert-mobilite',
        titre: 'Expert en Mobilité Durable',
        description: 'Développe des solutions de transport écologique',
        secteur: 'transport-durable',
        competencesRequises: [
          { nom: 'Planification transport', niveau: 'expert' },
          { nom: 'Études impact', niveau: 'avancé' },
          { nom: 'Smart City', niveau: 'avancé' },
          { nom: 'Analyse données', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Master Transport',
          'Ingénieur mobilité',
          'Urbanisme'
        ],
        perspectives: [
          'Directeur mobilité',
          'Consultant transport',
          'Chef de projet'
        ],
        environnementTravail: [
          'Collectivités',
          'Bureaux études',
          'Startups mobilité'
        ],
        tags: ['Transport', 'Écologie', 'Mobilité']
      },
      {
        id: 'logisticien-vert',
        titre: 'Logisticien Vert',
        description: 'Optimise la logistique avec une approche écologique',
        secteur: 'transport-durable',
        competencesRequises: [
          { nom: 'Logistique durable', niveau: 'expert' },
          { nom: 'Optimisation routes', niveau: 'avancé' },
          { nom: 'Supply chain verte', niveau: 'expert' },
          { nom: 'Gestion flottes', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 2800000 }
        },
        formation: [
          'Master Logistique',
          'Spécialisation RSE',
          'Supply Chain'
        ],
        perspectives: [
          'Directeur logistique',
          'Consultant green supply',
          'Responsable flotte'
        ],
        environnementTravail: [
          'Transporteurs',
          'E-commerce',
          'Industrie'
        ],
        tags: ['Logistique', 'Écologie', 'Transport']
      }
    ]
  },
  {
    id: 'cybersecurite',
    nom: 'Cybersécurité',
    description: 'Les métiers de la sécurité informatique et de la protection des données',
    icone: '🔒',
    couleur: '#ff4d4f',
    metiers: [
      {
        id: 'pentester',
        titre: 'Pentester',
        description: 'Teste la sécurité des systèmes informatiques par des simulations d\'attaques',
        secteur: 'cybersecurite',
        competencesRequises: [
          { nom: 'Ethical Hacking', niveau: 'expert' },
          { nom: 'Sécurité réseau', niveau: 'expert' },
          { nom: 'Scripting', niveau: 'avancé' },
          { nom: 'Analyse vulnérabilités', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Master Cybersécurité',
          'Certifications (CEH, OSCP)',
          'Formation continue'
        ],
        perspectives: [
          'Lead Pentester',
          'RSSI',
          'Consultant sécurité'
        ],
        environnementTravail: [
          'ESN',
          'Cabinets audit',
          'Grandes entreprises'
        ],
        tags: ['Sécurité', 'Hacking', 'Audit']
      },
      {
        id: 'analyste-soc',
        titre: 'Analyste SOC',
        description: 'Surveille et analyse les menaces de sécurité en temps réel',
        secteur: 'cybersecurite',
        competencesRequises: [
          { nom: 'SIEM', niveau: 'expert' },
          { nom: 'Analyse incidents', niveau: 'expert' },
          { nom: 'Forensics', niveau: 'avancé' },
          { nom: 'Threat Intelligence', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Master Sécurité',
          'Certifications (CISSP, GIAC)',
          'Formation SOC'
        ],
        perspectives: [
          'SOC Manager',
          'Analyste senior',
          'Expert sécurité'
        ],
        environnementTravail: [
          'Centres opérations',
          'ESN',
          'Grandes entreprises'
        ],
        tags: ['SOC', 'Sécurité', 'Monitoring']
      },
      {
        id: 'expert-blockchain',
        titre: 'Expert Blockchain & Sécurité',
        description: 'Développe et sécurise les solutions blockchain',
        secteur: 'cybersecurite',
        competencesRequises: [
          { nom: 'Blockchain', niveau: 'expert' },
          { nom: 'Smart Contracts', niveau: 'expert' },
          { nom: 'Cryptographie', niveau: 'avancé' },
          { nom: 'Sécurité Web3', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1600000 },
          confirme: { min: 1600000, max: 3200000 },
          senior: { min: 3200000, max: 5000000 }
        },
        formation: [
          'Master Cryptographie',
          'Formations blockchain',
          'Certifications sécurité'
        ],
        perspectives: [
          'Lead Blockchain',
          'Architecte Web3',
          'CTO'
        ],
        environnementTravail: [
          'Startups Web3',
          'Fintech',
          'Cabinets conseil'
        ],
        tags: ['Blockchain', 'Web3', 'Sécurité']
      }
    ]
  },
  {
    id: 'metaverse',
    nom: 'Métavers & Réalité Virtuelle',
    description: 'Les métiers des univers virtuels et de la réalité augmentée',
    icone: '🥽',
    couleur: '#722ed1',
    metiers: [
      {
        id: 'architecte-metaverse',
        titre: 'Architecte Métavers',
        description: 'Conçoit et développe des environnements virtuels immersifs',
        secteur: 'metaverse',
        competencesRequises: [
          { nom: 'Unity/Unreal', niveau: 'expert' },
          { nom: '3D Modeling', niveau: 'avancé' },
          { nom: 'VR/AR', niveau: 'expert' },
          { nom: 'UX 3D', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Master 3D/VR',
          'Game Design',
          'Architecture virtuelle'
        ],
        perspectives: [
          'Lead Metaverse',
          'Directeur créatif',
          'Entrepreneur VR'
        ],
        environnementTravail: [
          'Studios VR',
          'Tech companies',
          'Agences innovation'
        ],
        tags: ['Métavers', 'VR', '3D']
      },
      {
        id: 'social-vr-manager',
        titre: 'Social VR Manager',
        description: 'Gère les communautés et événements dans les mondes virtuels',
        secteur: 'metaverse',
        competencesRequises: [
          { nom: 'Community Management', niveau: 'expert' },
          { nom: 'Event VR', niveau: 'avancé' },
          { nom: 'Social Media', niveau: 'expert' },
          { nom: 'Modération', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 2800000 }
        },
        formation: [
          'Communication digitale',
          'VR Management',
          'Community Building'
        ],
        perspectives: [
          'Head of Metaverse',
          'Virtual Event Director',
          'Community Director'
        ],
        environnementTravail: [
          'Plateformes VR',
          'Marques luxe',
          'Agences événementielles'
        ],
        tags: ['Social', 'VR', 'Événementiel']
      }
    ]
  },
  {
    id: 'ia-robotique',
    nom: 'Intelligence Artificielle & Robotique',
    description: 'Les métiers de l\'IA, de la robotique et de l\'automatisation',
    icone: '🤖',
    couleur: '#1890ff',
    metiers: [
      {
        id: 'robotics-engineer',
        titre: 'Ingénieur en Robotique',
        description: 'Conçoit et développe des systèmes robotiques avancés',
        secteur: 'ia-robotique',
        competencesRequises: [
          { nom: 'Robotique', niveau: 'expert' },
          { nom: 'ROS', niveau: 'expert' },
          { nom: 'Vision par ordinateur', niveau: 'avancé' },
          { nom: 'Mécatronique', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1400000 },
          confirme: { min: 1400000, max: 2800000 },
          senior: { min: 2800000, max: 4500000 }
        },
        formation: [
          'Ingénieur Robotique',
          'Master Mécatronique',
          'Doctorat Robotique'
        ],
        perspectives: [
          'Lead Robotics',
          'Directeur R&D',
          'Entrepreneur Robotique'
        ],
        environnementTravail: [
          'Centres recherche',
          'Industries',
          'Startups robotique'
        ],
        tags: ['Robotique', 'IA', 'Automation']
      },
      {
        id: 'nlp-engineer',
        titre: 'Ingénieur NLP',
        description: 'Développe des solutions de traitement du langage naturel',
        secteur: 'ia-robotique',
        competencesRequises: [
          { nom: 'NLP', niveau: 'expert' },
          { nom: 'Deep Learning', niveau: 'expert' },
          { nom: 'Python', niveau: 'avancé' },
          { nom: 'MLOps', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1600000 },
          confirme: { min: 1600000, max: 3200000 },
          senior: { min: 3200000, max: 5000000 }
        },
        formation: [
          'Master IA/NLP',
          'Doctorat',
          'Certifications IA'
        ],
        perspectives: [
          'Lead NLP',
          'Architecte IA',
          'Chercheur Senior'
        ],
        environnementTravail: [
          'Tech companies',
          'Startups IA',
          'Laboratoires recherche'
        ],
        tags: ['NLP', 'IA', 'Machine Learning']
      }
    ]
  },
  {
    id: 'biotech',
    nom: 'Biotechnologie & Santé Connectée',
    description: 'Les métiers de la biotechnologie et de la santé numérique',
    icone: '🧬',
    couleur: '#eb2f96',
    metiers: [
      {
        id: 'bioinformaticien',
        titre: 'Bio-informaticien',
        description: 'Analyse les données biologiques avec des outils informatiques',
        secteur: 'biotech',
        competencesRequises: [
          { nom: 'Bio-informatique', niveau: 'expert' },
          { nom: 'Génomique', niveau: 'avancé' },
          { nom: 'Python/R', niveau: 'expert' },
          { nom: 'Machine Learning', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Master Bio-informatique',
          'Doctorat',
          'Formation continue'
        ],
        perspectives: [
          'Lead Bio-informatique',
          'Chercheur',
          'Directeur R&D'
        ],
        environnementTravail: [
          'Laboratoires',
          'Instituts recherche',
          'Biotech'
        ],
        tags: ['Bio-informatique', 'Génomique', 'Data']
      },
      {
        id: 'ingenieur-esante',
        titre: 'Ingénieur e-Santé',
        description: 'Développe des solutions numériques pour la santé',
        secteur: 'biotech',
        competencesRequises: [
          { nom: 'Développement santé', niveau: 'expert' },
          { nom: 'IoMT', niveau: 'avancé' },
          { nom: 'Sécurité médicale', niveau: 'expert' },
          { nom: 'Interopérabilité', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Ingénieur e-Santé',
          'Master Santé Numérique',
          'Certifications'
        ],
        perspectives: [
          'Architecte e-Santé',
          'Chef de projet',
          'Consultant e-Santé'
        ],
        environnementTravail: [
          'Startups e-santé',
          'Hôpitaux',
          'Éditeurs logiciels'
        ],
        tags: ['E-santé', 'Digital', 'Médical']
      }
    ]
  },
  {
    id: 'energie-verte',
    nom: 'Énergie Verte & Développement Durable',
    description: 'Les métiers des énergies renouvelables et du développement durable',
    icone: '♻️',
    couleur: '#52c41a',
    metiers: [
      {
        id: 'ingenieur-smart-grid',
        titre: 'Ingénieur Smart Grid',
        description: 'Développe et gère les réseaux électriques intelligents',
        secteur: 'energie-verte',
        competencesRequises: [
          { nom: 'Smart Grid', niveau: 'expert' },
          { nom: 'IoT Énergie', niveau: 'avancé' },
          { nom: 'Gestion réseau', niveau: 'expert' },
          { nom: 'Optimisation', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Ingénieur Énergie',
          'Master Smart Grid',
          'Certifications'
        ],
        perspectives: [
          'Chef de projet',
          'Directeur technique',
          'Consultant énergie'
        ],
        environnementTravail: [
          'Opérateurs énergie',
          'Startups',
          'Bureaux études'
        ],
        tags: ['Smart Grid', 'Énergie', 'IoT']
      },
      {
        id: 'expert-transition',
        titre: 'Expert en Transition Énergétique',
        description: 'Accompagne les organisations dans leur transition énergétique',
        secteur: 'energie-verte',
        competencesRequises: [
          { nom: 'Transition énergétique', niveau: 'expert' },
          { nom: 'Audit énergétique', niveau: 'expert' },
          { nom: 'Gestion projet', niveau: 'avancé' },
          { nom: 'RSE', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Master Énergie',
          'École ingénieur',
          'Certifications RSE'
        ],
        perspectives: [
          'Directeur RSE',
          'Consultant senior',
          'Entrepreneur'
        ],
        environnementTravail: [
          'Cabinets conseil',
          'Entreprises',
          'Collectivités'
        ],
        tags: ['Énergie', 'RSE', 'Transition']
      }
    ]
  },
  {
    id: 'smart-cities',
    nom: 'Smart Cities & IoT',
    description: 'Les métiers des villes intelligentes et de l\'Internet des objets',
    icone: '🏙️',
    couleur: '#13c2c2',
    metiers: [
      {
        id: 'architecte-smart-city',
        titre: 'Architecte Smart City',
        description: 'Conçoit et développe les infrastructures des villes intelligentes',
        secteur: 'smart-cities',
        competencesRequises: [
          { nom: 'Smart City', niveau: 'expert' },
          { nom: 'IoT', niveau: 'expert' },
          { nom: 'Urbanisme', niveau: 'avancé' },
          { nom: 'Big Data', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1400000 },
          confirme: { min: 1400000, max: 2800000 },
          senior: { min: 2800000, max: 4500000 }
        },
        formation: [
          'Master Smart Cities',
          'Urbanisme',
          'Ingénieur IoT'
        ],
        perspectives: [
          'Directeur Smart City',
          'Chef de projet',
          'Consultant'
        ],
        environnementTravail: [
          'Collectivités',
          'Bureaux études',
          'Entreprises tech'
        ],
        tags: ['Smart City', 'IoT', 'Urbanisme']
      },
      {
        id: 'expert-iot-industriel',
        titre: 'Expert IoT Industriel',
        description: 'Implémente des solutions IoT dans l\'industrie',
        secteur: 'smart-cities',
        competencesRequises: [
          { nom: 'IoT Industriel', niveau: 'expert' },
          { nom: 'Industrie 4.0', niveau: 'expert' },
          { nom: 'Automatisation', niveau: 'avancé' },
          { nom: 'Edge Computing', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Ingénieur IoT',
          'Master Industrie 4.0',
          'Certifications'
        ],
        perspectives: [
          'Directeur technique',
          'Architecte IoT',
          'Consultant industrie'
        ],
        environnementTravail: [
          'Industries',
          'ESN',
          'Startups IoT'
        ],
        tags: ['IoT', 'Industrie 4.0', 'Automation']
      }
    ]
  },
  {
    id: 'fintech-blockchain',
    nom: 'Fintech & Blockchain',
    description: 'Les métiers de la finance technologique et de la blockchain',
    icone: '💰',
    couleur: '#faad14',
    metiers: [
      {
        id: 'blockchain-developer',
        titre: 'Développeur Blockchain',
        description: 'Développe des applications décentralisées et des smart contracts',
        secteur: 'fintech-blockchain',
        competencesRequises: [
          { nom: 'Solidity', niveau: 'expert' },
          { nom: 'Web3.js', niveau: 'expert' },
          { nom: 'DeFi', niveau: 'avancé' },
          { nom: 'Cryptographie', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1600000 },
          confirme: { min: 1600000, max: 3200000 },
          senior: { min: 3200000, max: 5000000 }
        },
        formation: [
          'Master Blockchain',
          'Développement Web3',
          'Certifications blockchain'
        ],
        perspectives: [
          'Lead Blockchain',
          'Architecte DeFi',
          'CTO'
        ],
        environnementTravail: [
          'Startups Web3',
          'Banques',
          'Consortiums blockchain'
        ],
        tags: ['Blockchain', 'DeFi', 'Web3']
      },
      {
        id: 'fintech-product-owner',
        titre: 'Product Owner Fintech',
        description: 'Gère le développement de produits financiers innovants',
        secteur: 'fintech-blockchain',
        competencesRequises: [
          { nom: 'Product Management', niveau: 'expert' },
          { nom: 'Finance digitale', niveau: 'avancé' },
          { nom: 'Agilité', niveau: 'expert' },
          { nom: 'UX Finance', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Master Finance/Tech',
          'Product Management',
          'Certifications Agile'
        ],
        perspectives: [
          'CPO',
          'Directeur produit',
          'Entrepreneur Fintech'
        ],
        environnementTravail: [
          'Fintech',
          'Néobanques',
          'Startups finance'
        ],
        tags: ['Fintech', 'Product', 'Innovation']
      }
    ]
  },
  {
    id: 'economie-circulaire',
    nom: 'Économie Circulaire',
    description: 'Les métiers de l\'économie circulaire et du recyclage innovant',
    icone: '♻️',
    couleur: '#52c41a',
    metiers: [
      {
        id: 'expert-recyclage',
        titre: 'Expert en Recyclage Innovant',
        description: 'Développe des solutions de recyclage et de valorisation des déchets',
        secteur: 'economie-circulaire',
        competencesRequises: [
          { nom: 'Recyclage avancé', niveau: 'expert' },
          { nom: 'Chimie verte', niveau: 'avancé' },
          { nom: 'Gestion déchets', niveau: 'expert' },
          { nom: 'Innovation durable', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Ingénieur environnement',
          'Master économie circulaire',
          'Certifications'
        ],
        perspectives: [
          'Directeur recyclage',
          'Consultant économie circulaire',
          'Entrepreneur green'
        ],
        environnementTravail: [
          'Centres recyclage',
          'Industries',
          'Startups green'
        ],
        tags: ['Recyclage', 'Innovation', 'Environnement']
      },
      {
        id: 'consultant-eco-conception',
        titre: 'Consultant en Éco-conception',
        description: 'Conseille sur la conception durable des produits',
        secteur: 'economie-circulaire',
        competencesRequises: [
          { nom: 'Éco-conception', niveau: 'expert' },
          { nom: 'Analyse cycle vie', niveau: 'expert' },
          { nom: 'Design durable', niveau: 'avancé' },
          { nom: 'RSE', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 450000, max: 900000 },
          confirme: { min: 900000, max: 1800000 },
          senior: { min: 1800000, max: 3000000 }
        },
        formation: [
          'Master Design durable',
          'Ingénieur matériaux',
          'Certifications RSE'
        ],
        perspectives: [
          'Directeur innovation',
          'Chef de projet RSE',
          'Consultant senior'
        ],
        environnementTravail: [
          'Bureaux études',
          'Industries',
          'Cabinets conseil'
        ],
        tags: ['Éco-conception', 'Design', 'RSE']
      }
    ]
  },
  {
    id: 'agrotech',
    nom: 'Agrotech & Agriculture Urbaine',
    description: 'Les métiers de l\'agriculture technologique et urbaine',
    icone: '🌱',
    couleur: '#95de64',
    metiers: [
      {
        id: 'ingenieur-agriculture-verticale',
        titre: 'Ingénieur en Agriculture Verticale',
        description: 'Conçoit et gère des fermes verticales urbaines',
        secteur: 'agrotech',
        competencesRequises: [
          { nom: 'Agriculture verticale', niveau: 'expert' },
          { nom: 'Hydroponie', niveau: 'expert' },
          { nom: 'Automatisation', niveau: 'avancé' },
          { nom: 'IoT agricole', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Ingénieur agronome',
          'Spécialisation agriculture urbaine',
          'Certifications tech'
        ],
        perspectives: [
          'Directeur production',
          'Chef de projet',
          'Entrepreneur'
        ],
        environnementTravail: [
          'Fermes verticales',
          'Startups agrotech',
          'Centres R&D'
        ],
        tags: ['Agriculture', 'Innovation', 'Urbain']
      },
      {
        id: 'data-scientist-agriculture',
        titre: 'Data Scientist Agriculture',
        description: 'Analyse les données pour optimiser la production agricole',
        secteur: 'agrotech',
        competencesRequises: [
          { nom: 'Data Science', niveau: 'expert' },
          { nom: 'Agriculture précision', niveau: 'avancé' },
          { nom: 'Machine Learning', niveau: 'expert' },
          { nom: 'IoT', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Master Data Science',
          'Agronomie',
          'Certifications IA'
        ],
        perspectives: [
          'Lead Data Scientist',
          'Directeur innovation',
          'Consultant agrotech'
        ],
        environnementTravail: [
          'Startups agritech',
          'Centres recherche',
          'Grandes exploitations'
        ],
        tags: ['Agriculture', 'Data', 'IA']
      }
    ]
  },
  {
    id: 'industries-creatives-num',
    nom: 'Industries Créatives Numériques',
    description: 'Les métiers de la création numérique et du divertissement digital',
    icone: '🎨',
    couleur: '#722ed1',
    metiers: [
      {
        id: 'directeur-artistique-3d',
        titre: 'Directeur Artistique 3D',
        description: 'Dirige la création d\'univers virtuels et d\'expériences 3D',
        secteur: 'industries-creatives-num',
        competencesRequises: [
          { nom: '3D Design', niveau: 'expert' },
          { nom: 'Direction artistique', niveau: 'expert' },
          { nom: 'Réalité virtuelle', niveau: 'avancé' },
          { nom: 'Management créatif', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1400000 },
          confirme: { min: 1400000, max: 2800000 },
          senior: { min: 2800000, max: 4500000 }
        },
        formation: [
          'École art numérique',
          'Direction artistique',
          'Formation 3D'
        ],
        perspectives: [
          'Creative Director',
          'Studio Director',
          'Entrepreneur créatif'
        ],
        environnementTravail: [
          'Studios création',
          'Agences digitales',
          'Studios jeux'
        ],
        tags: ['3D', 'Art', 'Direction']
      },
      {
        id: 'concepteur-experiences-xr',
        titre: 'Concepteur d\'Expériences XR',
        description: 'Crée des expériences en réalité mixte (AR/VR/MR)',
        secteur: 'industries-creatives-num',
        competencesRequises: [
          { nom: 'XR Design', niveau: 'expert' },
          { nom: 'Unity/Unreal', niveau: 'expert' },
          { nom: 'UX immersif', niveau: 'avancé' },
          { nom: 'Prototypage', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          'Master XR',
          'Design interactif',
          'Certifications Unity/Unreal'
        ],
        perspectives: [
          'Lead XR Designer',
          'Directeur innovation',
          'Entrepreneur XR'
        ],
        environnementTravail: [
          'Studios XR',
          'Agences innovation',
          'Startups tech'
        ],
        tags: ['XR', 'Design', 'Innovation']
      }
    ]
  },
  {
    id: 'neurotech',
    nom: 'Neurotechnologies & Interface Cerveau-Machine',
    description: 'Les métiers à l\'intersection des neurosciences et de la technologie',
    icone: '🧠',
    couleur: '#eb2f96',
    metiers: [
      {
        id: 'ingenieur-bci',
        titre: 'Ingénieur Interface Cerveau-Machine',
        description: 'Développe des interfaces permettant la communication directe entre le cerveau et les machines',
        secteur: 'neurotech',
        competencesRequises: [
          { nom: 'Neurosciences', niveau: 'expert' },
          { nom: 'Traitement signal', niveau: 'expert' },
          { nom: 'IA neuromorphique', niveau: 'avancé' },
          { nom: 'Électronique biomédicale', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1600000 },
          confirme: { min: 1600000, max: 3200000 },
          senior: { min: 3200000, max: 5000000 }
        },
        formation: [
          'Doctorat Neurosciences',
          'Ingénieur biomédical',
          'Spécialisation BCI'
        ],
        perspectives: [
          'Directeur R&D',
          'Lead BCI',
          'Chercheur senior'
        ],
        environnementTravail: [
          'Laboratoires recherche',
          'Startups neurotech',
          'Centres médicaux'
        ],
        tags: ['Neurosciences', 'BCI', 'Innovation']
      },
      {
        id: 'neurorehabilitation',
        titre: 'Spécialiste Neuroréhabilitation',
        description: 'Développe des thérapies utilisant les neurotechnologies pour la rééducation',
        secteur: 'neurotech',
        competencesRequises: [
          { nom: 'Neuroréhabilitation', niveau: 'expert' },
          { nom: 'Technologies assistives', niveau: 'expert' },
          { nom: 'Neuroplasticité', niveau: 'avancé' },
          { nom: 'Robotique médicale', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Médecine/Kinésithérapie',
          'Spécialisation neurotech',
          'Formation continue'
        ],
        perspectives: [
          'Directeur clinique',
          'Chercheur clinique',
          'Entrepreneur médical'
        ],
        environnementTravail: [
          'Centres rééducation',
          'Cliniques spécialisées',
          'Startups medtech'
        ],
        tags: ['Médical', 'Neurotech', 'Rééducation']
      }
    ]
  },
  {
    id: 'quantum',
    nom: 'Quantum Computing',
    description: 'Les métiers de l\'informatique quantique',
    icone: '⚛️',
    couleur: '#722ed1',
    metiers: [
      {
        id: 'quantum-engineer',
        titre: 'Ingénieur Quantique',
        description: 'Développe et optimise les algorithmes quantiques',
        secteur: 'quantum',
        competencesRequises: [
          { nom: 'Informatique quantique', niveau: 'expert' },
          { nom: 'Physique quantique', niveau: 'expert' },
          { nom: 'Algorithmes quantiques', niveau: 'avancé' },
          { nom: 'Mathématiques avancées', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 1000000, max: 2000000 },
          confirme: { min: 2000000, max: 4000000 },
          senior: { min: 4000000, max: 6000000 }
        },
        formation: [
          'Doctorat Physique Quantique',
          'Master Informatique Quantique',
          'Formation spécialisée'
        ],
        perspectives: [
          'Lead Quantum',
          'Directeur recherche',
          'Consultant expert'
        ],
        environnementTravail: [
          'Centres recherche',
          'Tech companies',
          'Laboratoires'
        ],
        tags: ['Quantique', 'Recherche', 'Innovation']
      },
      {
        id: 'quantum-security',
        titre: 'Expert Sécurité Quantique',
        description: 'Développe des solutions de cryptographie post-quantique',
        secteur: 'quantum',
        competencesRequises: [
          { nom: 'Cryptographie quantique', niveau: 'expert' },
          { nom: 'Sécurité post-quantique', niveau: 'expert' },
          { nom: 'Théorie information', niveau: 'avancé' },
          { nom: 'Programmation', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1600000 },
          confirme: { min: 1600000, max: 3200000 },
          senior: { min: 3200000, max: 5000000 }
        },
        formation: [
          'Master Cryptographie',
          'Doctorat',
          'Certifications sécurité'
        ],
        perspectives: [
          'CISO Quantique',
          'Architecte sécurité',
          'Chercheur'
        ],
        environnementTravail: [
          'Instituts recherche',
          'Entreprises tech',
          'Agences gouvernementales'
        ],
        tags: ['Quantique', 'Sécurité', 'Cryptographie']
      }
    ]
  },
  {
    id: 'biologie-synthetique',
    nom: 'Biologie Synthétique',
    description: 'Les métiers de la conception et ingénierie biologique',
    icone: '🧬',
    couleur: '#52c41a',
    metiers: [
      {
        id: 'bio-designer',
        titre: 'Bio-Designer',
        description: 'Conçoit des organismes et systèmes biologiques synthétiques',
        secteur: 'biologie-synthetique',
        competencesRequises: [
          { nom: 'Biologie synthétique', niveau: 'expert' },
          { nom: 'Génie génétique', niveau: 'expert' },
          { nom: 'Bio-informatique', niveau: 'avancé' },
          { nom: 'Modélisation moléculaire', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1400000 },
          confirme: { min: 1400000, max: 2800000 },
          senior: { min: 2800000, max: 4500000 }
        },
        formation: [
          'Doctorat Biologie',
          'Master Bio-ingénierie',
          'Formation spécialisée'
        ],
        perspectives: [
          'Directeur R&D',
          'Lead Bio-Designer',
          'Entrepreneur biotech'
        ],
        environnementTravail: [
          'Laboratoires',
          'Startups biotech',
          'Centres recherche'
        ],
        tags: ['Biologie', 'Design', 'Innovation']
      },
      {
        id: 'bio-process-engineer',
        titre: 'Ingénieur Bioprocédés',
        description: 'Optimise les processus de production biologique',
        secteur: 'biologie-synthetique',
        competencesRequises: [
          { nom: 'Bioprocédés', niveau: 'expert' },
          { nom: 'Fermentation', niveau: 'expert' },
          { nom: 'Automatisation', niveau: 'avancé' },
          { nom: 'Contrôle qualité', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Ingénieur biotechnologies',
          'Master bioprocédés',
          'Certifications'
        ],
        perspectives: [
          'Directeur production',
          'Chef de projet',
          'Consultant expert'
        ],
        environnementTravail: [
          'Industries biotech',
          'Usines production',
          'Centres R&D'
        ],
        tags: ['Bioprocédés', 'Production', 'Biotech']
      }
    ]
  },
  {
    id: 'spatial',
    nom: 'Spatial & Aérospatial',
    description: 'Les métiers de l\'exploration spatiale et de l\'industrie aérospatiale',
    icone: '🚀',
    couleur: '#1890ff',
    metiers: [
      {
        id: 'ingenieur-spatial',
        titre: 'Ingénieur Spatial',
        description: 'Conçoit et développe des systèmes spatiaux',
        secteur: 'spatial',
        competencesRequises: [
          { nom: 'Ingénierie spatiale', niveau: 'expert' },
          { nom: 'Propulsion', niveau: 'expert' },
          { nom: 'Matériaux avancés', niveau: 'avancé' },
          { nom: 'Systèmes embarqués', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1600000 },
          confirme: { min: 1600000, max: 3200000 },
          senior: { min: 3200000, max: 5000000 }
        },
        formation: [
          'Ingénieur aérospatial',
          'Master spécialisé',
          'Doctorat'
        ],
        perspectives: [
          'Chef de projet spatial',
          'Directeur technique',
          'Consultant expert'
        ],
        environnementTravail: [
          'Agences spatiales',
          'Industries aérospatiales',
          'Startups NewSpace'
        ],
        tags: ['Spatial', 'Ingénierie', 'Innovation']
      },
      {
        id: 'astrobiologue',
        titre: 'Astrobiologue',
        description: 'Étudie les possibilités de vie dans l\'espace',
        secteur: 'spatial',
        competencesRequises: [
          { nom: 'Astrobiologie', niveau: 'expert' },
          { nom: 'Biochimie', niveau: 'expert' },
          { nom: 'Analyse données', niveau: 'avancé' },
          { nom: 'Exobiologie', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2400000 },
          senior: { min: 2400000, max: 4000000 }
        },
        formation: [
          'Doctorat Astrobiologie',
          'Master Biologie',
          'Formation spécialisée'
        ],
        perspectives: [
          'Chercheur senior',
          'Directeur recherche',
          'Consultant scientifique'
        ],
        environnementTravail: [
          'Centres recherche',
          'Universités',
          'Agences spatiales'
        ],
        tags: ['Astrobiologie', 'Recherche', 'Espace']
      }
    ]
  },
  {
    id: 'technique-artisanat',
    nom: 'Technique & Artisanat',
    description: 'Les métiers techniques, manuels et artisanaux',
    icone: '🔧',
    couleur: '#597ef7',
    metiers: [
      {
        id: 'mecanicien-auto',
        titre: 'Mécanicien Automobile',
        description: 'Diagnostique et répare les véhicules, assure leur maintenance',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Mécanique auto', niveau: 'expert' },
          { nom: 'Diagnostic électronique', niveau: 'avancé' },
          { nom: 'Maintenance préventive', niveau: 'expert' },
          { nom: 'Nouvelles motorisations', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 200000, max: 400000 },
          confirme: { min: 400000, max: 800000 },
          senior: { min: 800000, max: 1500000 }
        },
        formation: [
          'CAP/BEP Mécanique',
          'Bac Pro Automobile',
          'Certifications constructeurs'
        ],
        perspectives: [
          'Chef d\'atelier',
          'Responsable technique',
          'Garage indépendant'
        ],
        environnementTravail: [
          'Garages',
          'Concessionnaires',
          'Centres auto'
        ],
        tags: ['Automobile', 'Mécanique', 'Maintenance']
      },
      {
        id: 'electricien',
        titre: 'Électricien',
        description: 'Installe et maintient les systèmes électriques',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Installation électrique', niveau: 'expert' },
          { nom: 'Normes sécurité', niveau: 'expert' },
          { nom: 'Domotique', niveau: 'avancé' },
          { nom: 'Lecture plans', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 200000, max: 400000 },
          confirme: { min: 400000, max: 800000 },
          senior: { min: 800000, max: 1500000 }
        },
        formation: [
          'CAP Électricien',
          'Bac Pro Électrotechnique',
          'Habilitations électriques'
        ],
        perspectives: [
          'Chef de chantier',
          'Artisan indépendant',
          'Responsable maintenance'
        ],
        environnementTravail: [
          'Chantiers',
          'Entreprises',
          'Particuliers'
        ],
        tags: ['Électricité', 'Installation', 'Maintenance']
      },
      {
        id: 'plombier',
        titre: 'Plombier',
        description: 'Installe et répare les systèmes de plomberie et sanitaires',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Plomberie', niveau: 'expert' },
          { nom: 'Sanitaire', niveau: 'expert' },
          { nom: 'Chauffage', niveau: 'avancé' },
          { nom: 'Lecture plans', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 200000, max: 400000 },
          confirme: { min: 400000, max: 800000 },
          senior: { min: 800000, max: 1500000 }
        },
        formation: [
          'CAP Plomberie',
          'BP Plomberie',
          'Formations continues'
        ],
        perspectives: [
          'Artisan indépendant',
          'Chef d\'équipe',
          'Responsable technique'
        ],
        environnementTravail: [
          'Chantiers',
          'Particuliers',
          'Entreprises'
        ],
        tags: ['Plomberie', 'Sanitaire', 'Installation']
      },
      {
        id: 'climaticien',
        titre: 'Technicien Climatisation',
        description: 'Installe et maintient les systèmes de climatisation et de réfrigération',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Climatisation', niveau: 'expert' },
          { nom: 'Froid industriel', niveau: 'avancé' },
          { nom: 'Maintenance', niveau: 'expert' },
          { nom: 'Diagnostic', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 250000, max: 500000 },
          confirme: { min: 500000, max: 1000000 },
          senior: { min: 1000000, max: 2000000 }
        },
        formation: [
          'CAP Froid/Clim',
          'Bac Pro Énergétique',
          'Certifications'
        ],
        perspectives: [
          'Chef d\'équipe',
          'Technicien spécialisé',
          'Entrepreneur'
        ],
        environnementTravail: [
          'Entreprises',
          'Chantiers',
          'Industries'
        ],
        tags: ['Climatisation', 'Froid', 'Maintenance']
      },
      {
        id: 'carrossier',
        titre: 'Carrossier-Peintre',
        description: 'Répare et restaure la carrosserie des véhicules',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Carrosserie', niveau: 'expert' },
          { nom: 'Peinture auto', niveau: 'expert' },
          { nom: 'Soudure', niveau: 'avancé' },
          { nom: 'Diagnostic', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 200000, max: 400000 },
          confirme: { min: 400000, max: 800000 },
          senior: { min: 800000, max: 1500000 }
        },
        formation: [
          'CAP Carrosserie',
          'Bac Pro Carrosserie',
          'Formations constructeurs'
        ],
        perspectives: [
          'Chef d\'atelier',
          'Artisan indépendant',
          'Expert automobile'
        ],
        environnementTravail: [
          'Garages',
          'Carrosseries',
          'Concessionnaires'
        ],
        tags: ['Carrosserie', 'Peinture', 'Automobile']
      },
      {
        id: 'menuisier',
        titre: 'Menuisier',
        description: 'Fabrique et installe des ouvrages en bois',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Menuiserie', niveau: 'expert' },
          { nom: 'Lecture plans', niveau: 'avancé' },
          { nom: 'Machines-outils', niveau: 'expert' },
          { nom: 'Finitions', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 200000, max: 400000 },
          confirme: { min: 400000, max: 800000 },
          senior: { min: 800000, max: 1500000 }
        },
        formation: [
          'CAP Menuiserie',
          'BP Menuiserie',
          'Formation continue'
        ],
        perspectives: [
          'Artisan indépendant',
          'Chef d\'atelier',
          'Formateur'
        ],
        environnementTravail: [
          'Ateliers',
          'Chantiers',
          'Particuliers'
        ],
        tags: ['Menuiserie', 'Bois', 'Artisanat']
      },
      {
        id: 'soudeur',
        titre: 'Soudeur',
        description: 'Assemble et soude des pièces métalliques selon différentes techniques',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Techniques soudure', niveau: 'expert' },
          { nom: 'Lecture plans', niveau: 'avancé' },
          { nom: 'Métallurgie', niveau: 'avancé' },
          { nom: 'Sécurité', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 250000, max: 500000 },
          confirme: { min: 500000, max: 1000000 },
          senior: { min: 1000000, max: 2000000 }
        },
        formation: [
          'CAP Soudure',
          'Certifications spécialisées',
          'Formations techniques'
        ],
        perspectives: [
          'Chef soudeur',
          'Artisan indépendant',
          'Formateur technique'
        ],
        environnementTravail: [
          'Industries',
          'Chantiers navals',
          'BTP'
        ],
        tags: ['Soudure', 'Métallurgie', 'Industrie']
      },
      {
        id: 'mecanicien-moto',
        titre: 'Mécanicien Moto',
        description: 'Répare et entretient les deux-roues motorisés',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Mécanique moto', niveau: 'expert' },
          { nom: 'Diagnostic', niveau: 'avancé' },
          { nom: 'Électronique', niveau: 'intermédiaire' },
          { nom: 'Service client', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 200000, max: 400000 },
          confirme: { min: 400000, max: 800000 },
          senior: { min: 800000, max: 1500000 }
        },
        formation: [
          'CAP Mécanique moto',
          'Formations constructeurs',
          'Certifications spécialisées'
        ],
        perspectives: [
          'Chef d\'atelier',
          'Garage indépendant',
          'Technicien spécialisé'
        ],
        environnementTravail: [
          'Concessions moto',
          'Garages spécialisés',
          'Ateliers réparation'
        ],
        tags: ['Moto', 'Mécanique', 'Deux-roues']
      },
      {
        id: 'macon',
        titre: 'Maçon',
        description: 'Construit et rénove les structures en maçonnerie',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Maçonnerie', niveau: 'expert' },
          { nom: 'Lecture plans', niveau: 'avancé' },
          { nom: 'Techniques construction', niveau: 'expert' },
          { nom: 'Sécurité chantier', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 200000, max: 400000 },
          confirme: { min: 400000, max: 800000 },
          senior: { min: 800000, max: 1600000 }
        },
        formation: [
          'CAP Maçonnerie',
          'BP Maçonnerie',
          'Formations continues'
        ],
        perspectives: [
          'Chef d\'équipe',
          'Artisan indépendant',
          'Conducteur de travaux'
        ],
        environnementTravail: [
          'Chantiers construction',
          'Entreprises BTP',
          'Rénovation'
        ],
        tags: ['Construction', 'BTP', 'Bâtiment']
      },
      {
        id: 'peintre-batiment',
        titre: 'Peintre en Bâtiment',
        description: 'Réalise les travaux de peinture, décoration et revêtements',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Techniques peinture', niveau: 'expert' },
          { nom: 'Revêtements', niveau: 'expert' },
          { nom: 'Préparation supports', niveau: 'avancé' },
          { nom: 'Décoration', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 180000, max: 350000 },
          confirme: { min: 350000, max: 700000 },
          senior: { min: 700000, max: 1400000 }
        },
        formation: [
          'CAP Peinture',
          'BP Peinture',
          'Formations décoration'
        ],
        perspectives: [
          'Chef d\'équipe',
          'Artisan peintre',
          'Décorateur'
        ],
        environnementTravail: [
          'Chantiers',
          'Particuliers',
          'Entreprises'
        ],
        tags: ['Peinture', 'Décoration', 'Bâtiment']
      },
      {
        id: 'electronicien',
        titre: 'Électronicien',
        description: 'Répare et maintient les équipements électroniques',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Électronique', niveau: 'expert' },
          { nom: 'Diagnostic', niveau: 'expert' },
          { nom: 'Soudure composants', niveau: 'avancé' },
          { nom: 'Programmation', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 250000, max: 500000 },
          confirme: { min: 500000, max: 1000000 },
          senior: { min: 1000000, max: 2000000 }
        },
        formation: [
          'BEP Électronique',
          'Bac Pro Électronique',
          'BTS Électronique'
        ],
        perspectives: [
          'Technicien spécialisé',
          'Chef d\'atelier',
          'Responsable maintenance'
        ],
        environnementTravail: [
          'Industries',
          'SAV',
          'Ateliers réparation'
        ],
        tags: ['Électronique', 'Maintenance', 'Réparation']
      },
      {
        id: 'vitrier',
        titre: 'Vitrier',
        description: 'Installe et remplace tous types de vitrages et menuiseries',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Pose vitrage', niveau: 'expert' },
          { nom: 'Menuiserie', niveau: 'avancé' },
          { nom: 'Miroiterie', niveau: 'expert' },
          { nom: 'Sécurité', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 200000, max: 400000 },
          confirme: { min: 400000, max: 800000 },
          senior: { min: 800000, max: 1500000 }
        },
        formation: [
          'CAP Miroiterie',
          'CAP Menuiserie',
          'Formations spécialisées'
        ],
        perspectives: [
          'Artisan vitrier',
          'Chef d\'équipe',
          'Responsable atelier'
        ],
        environnementTravail: [
          'Ateliers miroiterie',
          'Chantiers',
          'Particuliers'
        ],
        tags: ['Vitrerie', 'Miroiterie', 'Bâtiment']
      },
      {
        id: 'carreleur',
        titre: 'Carreleur',
        description: 'Pose et rénove les revêtements en carrelage et mosaïque',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Pose carrelage', niveau: 'expert' },
          { nom: 'Préparation supports', niveau: 'expert' },
          { nom: 'Lecture plans', niveau: 'avancé' },
          { nom: 'Finitions', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 200000, max: 400000 },
          confirme: { min: 400000, max: 800000 },
          senior: { min: 800000, max: 1600000 }
        },
        formation: [
          'CAP Carrelage',
          'BP Carrelage',
          'Formations continues'
        ],
        perspectives: [
          'Artisan carreleur',
          'Chef de chantier',
          'Formateur'
        ],
        environnementTravail: [
          'Chantiers construction',
          'Rénovation',
          'Particuliers'
        ],
        tags: ['Carrelage', 'Construction', 'Bâtiment']
      },
      {
        id: 'mecanicien-pl',
        titre: 'Mécanicien Poids Lourds',
        description: 'Entretient et répare les véhicules poids lourds et engins',
        secteur: 'technique-artisanat',
        competencesRequises: [
          { nom: 'Mécanique PL', niveau: 'expert' },
          { nom: 'Diagnostic', niveau: 'expert' },
          { nom: 'Hydraulique', niveau: 'avancé' },
          { nom: 'Électronique embarquée', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 300000, max: 600000 },
          confirme: { min: 600000, max: 1200000 },
          senior: { min: 1200000, max: 2400000 }
        },
        formation: [
          'CAP Mécanique PL',
          'Bac Pro Maintenance PL',
          'Certifications constructeurs'
        ],
        perspectives: [
          'Chef d\'atelier PL',
          'Responsable technique',
          'Formateur technique'
        ],
        environnementTravail: [
          'Garages PL',
          'Concessions',
          'Flottes transport'
        ],
        tags: ['Poids Lourds', 'Mécanique', 'Transport']
      }
    ]
  }
];

const CareersPage: React.FC = () => {
  const { loading: isLoading, user } = useAuth();
  const { hasActiveSubscription, loading: loadingSub } = useSubscription();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetier, setSelectedMetier] = useState<FicheMetier | null>(null);
  const [forceShow, setForceShow] = useState(false);
  const isPremium = hasPremiumAccess(user, hasActiveSubscription);

  // Timeout de fallback pour éviter le blocage sur loading
  React.useEffect(() => {
    const timer = setTimeout(() => setForceShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Attendre le chargement du user
  if ((isLoading || loadingSub) && !forceShow) {
    return <div style={{ textAlign: 'center', marginTop: 100 }}><Spin size="large" tip="Chargement..." /></div>;
  }
  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: 100 }}><Spin size="large" tip="Chargement..." /></div>;
  }

  const filteredSecteurs = useMemo(() => {
    if (!searchTerm) return secteurs;
    return secteurs.map(secteur => ({
      ...secteur,
      metiers: secteur.metiers.filter(metier =>
        metier.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metier.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metier.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })).filter(secteur => secteur.metiers.length > 0);
  }, [searchTerm]);

  const renderCompetenceLevel = (niveau: Competence['niveau']) => {
    const levels = {
      'débutant': 1,
      'intermédiaire': 2,
      'avancé': 3,
      'expert': 4
    };
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: i < levels[niveau] ? '#1890ff' : '#f0f0f0'
            }}
          />
        ))}
      </div>
    );
  };

  const showMetierDetail = (metier: FicheMetier) => {
    if (!isPremium) {
      Modal.info({
        title: 'Fonctionnalité réservée',
        content: 'Cette fonctionnalité est réservée aux abonnés. Abonnez-vous pour consulter le détail des métiers.',
        onOk: () => navigate('/subscription')
      });
      return;
    }
    setSelectedMetier(metier);
  };

  // Header premium
  const headerStyle = {
    background: 'linear-gradient(90deg, #e6f0ff 0%, #f7faff 100%)',
    borderRadius: 24,
    padding: '32px 16px 24px 16px',
    marginBottom: 32,
    textAlign: 'center' as const,
    boxShadow: '0 4px 24px #e3e8f7',
    maxWidth: 900,
    margin: '0 auto 32px auto',
  };

  return (
    <div style={{ padding: '40px 8px', background: '#f7faff', minHeight: '100vh' }}>
      <div style={headerStyle}>
        <Title level={1} style={{ color: '#1890ff', fontWeight: 800, marginBottom: 8 }}>Fiches Métiers</Title>
        <Paragraph style={{ fontSize: 18, color: '#333', marginBottom: 0 }}>
          Découvrez les métiers qui recrutent au Sénégal et leurs perspectives d'évolution
        </Paragraph>
      </div>
      {!isPremium && user?.role !== 'admin' && (
        <div style={{
          background: 'linear-gradient(90deg, #fffbe6 0%, #f7faff 100%)',
          border: '1.5px solid #ffe58f',
          borderRadius: 16,
          padding: '18px 12px',
          margin: '0 auto 32px auto',
          maxWidth: 700,
          textAlign: 'center',
          color: '#ad8b00',
          fontWeight: 600,
          fontSize: 17,
          boxShadow: '0 2px 8px #ffe58f33',
        }}>
          <span>Pour consulter le détail des fiches métiers, <span style={{color:'#1890ff', fontWeight:700}}>abonnez-vous</span> à la plateforme !</span>
          <br />
          <button
            style={{
              marginTop: 10,
              background: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 22px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #1890ff22',
              transition: 'background 0.2s',
            }}
            onClick={() => navigate('/subscription')}
          >
            S'abonner
          </button>
        </div>
      )}
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row justify="center" style={{ marginBottom: 32 }}>
          <Col xs={24} sm={16} md={12}>
            <Search
              placeholder="Rechercher un métier..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
        <Tabs defaultActiveKey="all" centered>
          <TabPane tab="Tous les secteurs" key="all">
            {filteredSecteurs.map(secteur => (
              <div key={secteur.id} style={{ marginBottom: 48 }}>
                <Space align="center" style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 32 }}>{secteur.icone}</span>
                  <Title level={2} style={{ margin: 0, color: secteur.couleur }}>{secteur.nom}</Title>
                </Space>
                <Paragraph style={{ marginBottom: 24 }}>{secteur.description}</Paragraph>
                <Row gutter={[24, 24]}>
                  {secteur.metiers.map(metier => (
                    <Col key={metier.id} xs={24} md={12} lg={8} style={{ display: 'flex' }}>
                      <Card
                        hoverable={isPremium}
                        style={{
                          height: '100%',
                          borderRadius: 18,
                          boxShadow: '0 4px 24px #e3e8f7',
                          border: 'none',
                          background: '#fff',
                          marginBottom: 24,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          width: '100%',
                          maxWidth: 400,
                          margin: '0 auto',
                        }}
                        onClick={isPremium ? () => showMetierDetail(metier) : undefined}
                      >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          <Title level={4} style={{ margin: 0 }}>{metier.titre}</Title>
                          <Paragraph>{metier.description}</Paragraph>
                          <div>
                            {metier.tags.map(tag => (
                              <Tag key={tag} color={secteur.couleur} style={{ fontSize: 15 }}>{tag}</Tag>
                            ))}
                          </div>
                          <Button
                            type={isPremium ? 'primary' : 'default'}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 8,
                              borderRadius: 20,
                              fontWeight: 700,
                              background: isPremium ? '#1890ff' : '#fff',
                              color: isPremium ? '#fff' : '#bbb',
                              border: isPremium ? 'none' : '1.5px solid #eee',
                              fontSize: 16,
                              padding: '8px 24px',
                              width: '100%',
                              maxWidth: 180,
                              margin: '0 auto',
                              cursor: 'pointer',
                              opacity: 1,
                              boxShadow: '0 2px 8px #e3e8f7',
                              transition: 'all 0.2s',
                              height: 44,
                            }}
                            onClick={() => {
                              if (isPremium) {
                                showMetierDetail(metier);
                              } else {
                                navigate('/subscription');
                              }
                            }}
                          >
                            {!isPremium ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                background: '#fff',
                                boxShadow: '0 2px 8px #e3e8f7',
                              }}>
                                <LockOutlined style={{ color: '#bbb', fontSize: 18 }} />
                              </span>
                            ) : <ArrowRightOutlined />}
                            <span>Consulter</span>
                          </Button>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </TabPane>
          {secteurs.map(secteur => (
            <TabPane tab={`${secteur.icone} ${secteur.nom}`} key={secteur.id}>
              <Row gutter={[24, 24]}>
                {secteur.metiers.map(metier => (
                  <Col key={metier.id} xs={24} md={12} lg={8} style={{ display: 'flex' }}>
                    <Card
                      hoverable={isPremium}
                      style={{
                        height: '100%',
                        borderRadius: 18,
                        boxShadow: '0 4px 24px #e3e8f7',
                        border: 'none',
                        background: '#fff',
                        marginBottom: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        width: '100%',
                        maxWidth: 400,
                        margin: '0 auto',
                      }}
                      onClick={isPremium ? () => showMetierDetail(metier) : undefined}
                    >
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Title level={4} style={{ margin: 0 }}>{metier.titre}</Title>
                        <Paragraph>{metier.description}</Paragraph>
                        <div>
                          {metier.tags.map(tag => (
                            <Tag key={tag} color={secteur.couleur} style={{ fontSize: 15 }}>{tag}</Tag>
                          ))}
                        </div>
                        <Button
                          type={isPremium ? 'primary' : 'default'}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            borderRadius: 20,
                            fontWeight: 700,
                            background: isPremium ? '#1890ff' : '#fff',
                            color: isPremium ? '#fff' : '#bbb',
                            border: isPremium ? 'none' : '1.5px solid #eee',
                            fontSize: 16,
                            padding: '8px 24px',
                            width: '100%',
                            maxWidth: 180,
                            margin: '0 auto',
                            cursor: 'pointer',
                            opacity: 1,
                            boxShadow: '0 2px 8px #e3e8f7',
                            transition: 'all 0.2s',
                            height: 44,
                          }}
                          onClick={() => {
                            if (isPremium) {
                              showMetierDetail(metier);
                            } else {
                              navigate('/subscription');
                            }
                          }}
                        >
                          {!isPremium ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: '#fff',
                              boxShadow: '0 2px 8px #e3e8f7',
                            }}>
                              <LockOutlined style={{ color: '#bbb', fontSize: 18 }} />
                            </span>
                          ) : <ArrowRightOutlined />}
                          <span>Consulter</span>
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </TabPane>
          ))}
        </Tabs>
        <Modal
          visible={!!selectedMetier}
          onCancel={() => setSelectedMetier(null)}
          footer={null}
          width={800}
        >
          {selectedMetier && (
            <div>
              <Title level={2}>{selectedMetier.titre}</Title>
              <Paragraph>{selectedMetier.description}</Paragraph>

              <Title level={3}>Salaires</Title>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Junior"
                      value={`${formatNumberToCurrency(selectedMetier.salaireMoyen.junior.min)} - ${formatNumberToCurrency(selectedMetier.salaireMoyen.junior.max)}`}
                      suffix="FCFA"
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Confirmé"
                      value={`${formatNumberToCurrency(selectedMetier.salaireMoyen.confirme.min)} - ${formatNumberToCurrency(selectedMetier.salaireMoyen.confirme.max)}`}
                      suffix="FCFA"
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Senior"
                      value={`${formatNumberToCurrency(selectedMetier.salaireMoyen.senior.min)} - ${formatNumberToCurrency(selectedMetier.salaireMoyen.senior.max)}`}
                      suffix="FCFA"
                    />
                  </Card>
                </Col>
              </Row>

              <Title level={3} style={{ marginTop: 24 }}>Compétences requises</Title>
              <Row gutter={[16, 16]}>
                {selectedMetier.competencesRequises.map(comp => (
                  <Col key={comp.nom} span={12}>
                    <Card size="small">
                      <Space>
                        <Text>{comp.nom}</Text>
                        {renderCompetenceLevel(comp.niveau)}
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row gutter={24} style={{ marginTop: 24 }}>
                <Col span={8}>
                  <Title level={3}>
                    <BookOutlined /> Formation
                  </Title>
                  <ul>
                    {selectedMetier.formation.map(f => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </Col>
                <Col span={8}>
                  <Title level={3}>
                    <TrophyOutlined /> Perspectives
                  </Title>
                  <ul>
                    {selectedMetier.perspectives.map(p => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </Col>
                <Col span={8}>
                  <Title level={3}>
                    <EnvironmentOutlined /> Environnement
                  </Title>
                  <ul>
                    {selectedMetier.environnementTravail.map(e => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </Space>
    </div>
  );
};

export default CareersPage; 