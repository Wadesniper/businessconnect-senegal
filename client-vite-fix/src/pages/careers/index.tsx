import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Typography, Button, Space, Tag, Input, Tabs, Modal, Statistic, Spin } from 'antd';
import { SearchOutlined, ArrowRightOutlined, EnvironmentOutlined, BookOutlined, TrophyOutlined, LockOutlined } from '@ant-design/icons';
import type { Secteur, FicheMetier, Competence } from './types';
import { formatNumberToCurrency } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
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
    description: "Le secteur moteur de l'innovation au Sénégal, au cœur du Plan Sénégal Émergent. Des startups de la Fintech aux ESN structurées, les opportunités sont nombreuses.",
    icone: '💻',
    couleur: '#1890ff',
    metiers: [
      {
        id: 'dev-fullstack',
        titre: 'Développeur Full Stack',
        description: "Véritable couteau suisse du web, le développeur Full Stack est capable de construire une application de A à Z. Au Sénégal, il est très recherché par les startups (Wave, InTouch), les agences digitales et les banques pour développer des solutions web et mobiles innovantes.",
        secteur: 'tech',
        missions: [
          "Analyser les besoins des clients et rédiger les spécifications techniques.",
          "Développer l'architecture backend avec des technologies comme Node.js, Django ou Symfony.",
          "Créer des interfaces utilisateur réactives et modernes avec React, Angular ou Vue.js.",
          "Intégrer des API tierces, notamment les solutions de paiement mobile (Orange Money, Wave).",
          "Automatiser les tests et le déploiement (CI/CD) sur des plateformes cloud (AWS, Azure, OVH)."
        ],
        competencesRequises: [
          { nom: 'JavaScript/TypeScript', niveau: 'avancé' },
          { nom: 'Framework Frontend (React/Angular)', niveau: 'avancé' },
          { nom: 'Framework Backend (Node.js/PHP/Python)', niveau: 'avancé' },
          { nom: 'Gestion de bases de données (PostgreSQL, MySQL, MongoDB)', niveau: 'intermédiaire' },
          { nom: 'Maîtrise de Git et des méthodologies agiles (Scrum)', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 450000, max: 800000 },
          confirme: { min: 800000, max: 1500000 },
          senior: { min: 1500000, max: 2800000 }
        },
        formation: [
          'Bac+3 à Bac+5 en Informatique (ESP, UVS, ISM).',
          'Écoles privées spécialisées (Simplon, Sonatel Academy).',
          'Auto-formation et certifications en ligne (très valorisées).'
        ],
        perspectives: [
          'Lead Developer',
          'Architecte Logiciel',
          'Chef de Projet Technique (CTO) dans une startup.'
        ],
        environnementTravail: [
          'Startups et Hubs d\'innovation (Dakar)',
          'Entreprises de Services du Numérique (ESN)',
          'Grandes entreprises (banques, télécoms, assurances).'
        ],
        tags: ['Développement', 'Web', 'Mobile', 'Fintech']
      },
      {
        id: 'data-scientist',
        titre: 'Data Scientist / Analyst',
        description: "Le Data Scientist transforme les données brutes en informations stratégiques. Avec l'explosion de la data (télécoms, mobile money, e-commerce), ce rôle est devenu crucial pour optimiser les décisions, prédire les tendances et personnaliser les services.",
        secteur: 'tech',
        missions: [
          "Collecter, nettoyer et structurer les données provenant de multiples sources.",
          "Construire des modèles statistiques et des algorithmes de Machine Learning pour résoudre des problèmes business (ex: score de crédit, prédiction de churn).",
          "Créer des dashboards et des visualisations de données pour la direction (Power BI, Tableau).",
          "Présenter les résultats de manière claire et concise aux équipes non-techniques.",
          "Assurer une veille sur les nouvelles techniques d'analyse de données et d'IA."
        ],
        competencesRequises: [
          { nom: 'Python (Pandas, Scikit-learn, TensorFlow)', niveau: 'avancé' },
          { nom: 'Maîtrise des statistiques et des probabilités', niveau: 'avancé' },
          { nom: 'SQL et manipulation de bases de données', niveau: 'avancé' },
          { nom: 'Outils de Business Intelligence (Power BI, Tableau)', niveau: 'intermédiaire' },
          { nom: 'Compréhension business et communication', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1000000 },
          confirme: { min: 1000000, max: 1800000 },
          senior: { min: 1800000, max: 3500000 }
        },
        formation: [
          'Master en Statistique, Économétrie ou Informatique (UCAD, ESP, AIMS).',
          'École d\'ingénieur avec spécialisation Big Data/IA.',
          'Doctorat dans un domaine quantitatif (un plus pour la R&D).'
        ],
        perspectives: [
          'Lead Data Scientist',
          'ML Engineer (Ingénieur Machine Learning)',
          'Chief Data Officer (CDO).'
        ],
        environnementTravail: [
          'Opérateurs Télécoms (Sonatel, Free)',
          'Banques et institutions financières',
          'Cabinets de conseil et agences spécialisées en data.'
        ],
        tags: ['Data', 'IA', 'Business Intelligence', 'Statistiques']
      },
      {
        id: 'cybersecurity-expert',
        titre: 'Expert en Cybersécurité',
        description: "Le protecteur des actifs numériques de l'entreprise. Face à la professionnalisation des cyberattaques, il est indispensable pour sécuriser les systèmes d'information, surtout dans des secteurs critiques comme la banque et les services publics.",
        secteur: 'tech',
        missions: [
          "Effectuer des audits de sécurité et des tests d'intrusion (pentesting).",
          "Mettre en place et gérer les outils de sécurité (Firewall, SIEM, EDR).",
          "Définir la politique de sécurité et veiller à son application.",
          "Répondre aux incidents de sécurité et mener les investigations (forensics).",
          "Former et sensibiliser les collaborateurs aux risques cyber."
        ],
        competencesRequises: [
          { nom: 'Sécurité des réseaux et systèmes', niveau: 'expert' },
          { nom: 'Analyse de vulnérabilités et techniques d\'attaque', niveau: 'avancé' },
          { nom: 'Connaissance des normes (ISO 27001) et réglementations (Loi sur la protection des données personnelles)', niveau: 'avancé' },
          { nom: 'Gestion de crise et sang-froid', niveau: 'expert' },
          { nom: 'Veille constante sur les menaces', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1200000 },
          confirme: { min: 1200000, max: 2200000 },
          senior: { min: 2200000, max: 4000000 }
        },
        formation: [
          'Master en Cybersécurité ou Sécurité des SI.',
          'Certifications professionnelles reconnues (CEH, OSCP, CISSP).',
          'École d\'ingénieur avec une forte spécialisation en sécurité informatique.'
        ],
        perspectives: [
          'Responsable de la Sécurité des Systèmes d\'Information (RSSI)',
          'Architecte Sécurité',
          'Consultant en cybersécurité pour les grands comptes.'
        ],
        environnementTravail: [
          'Banques, assurances et institutions financières',
          'Administrations publiques et agences gouvernementales (CSI, ANSSI-SN)',
          'Opérateurs d\'Importance Vitale (OIV) comme Senelec, SDE.'
        ],
        tags: ['Sécurité', 'Réseau', 'Pentesting', 'Gouvernance']
      },
       {
        id: 'chef-projet-digital',
        titre: 'Chef de Projet Digital / Product Owner',
        description: "L'organisateur de la transformation numérique. Il fait le pont entre les équipes métier et les équipes techniques pour garantir que les projets digitaux (site web, application, etc.) soient livrés à temps, dans le budget et qu'ils répondent aux attentes des utilisateurs.",
        secteur: 'tech',
        missions: [
          "Recueillir les besoins métier et les traduire en fonctionnalités (user stories).",
          "Gérer le backlog produit et prioriser les développements.",
          "Planifier les sprints et animer les rituels agiles (daily, sprint review).",
          "Coordonner le travail des développeurs, designers et autres parties prenantes.",
          "Suivre les KPIs du projet et communiquer sur l'avancement."
        ],
        competencesRequises: [
          { nom: 'Méthodologies Agiles (Scrum, Kanban)', niveau: 'expert' },
          { nom: 'Gestion de projet (planning, budget, risques)', niveau: 'avancé' },
          { nom: 'Excellente communication et leadership', niveau: 'expert' },
          { nom: 'Culture technique pour dialoguer avec les développeurs', niveau: 'intermédiaire' },
          { nom: 'Outils de gestion (Jira, Trello, Asana)', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 900000 },
          confirme: { min: 900000, max: 1600000 },
          senior: { min: 1600000, max: 2800000 }
        },
        formation: [
          'École de commerce avec une spécialisation digitale.',
          'Master en Management de l\'Innovation ou Gestion de Projet.',
          'Anciens développeurs ou marketeurs évoluant vers la gestion de produit.'
        ],
        perspectives: [
          'Head of Product (Directeur Produit)',
          'Responsable de la transformation digitale',
          'Consultant en organisation et management.'
        ],
        environnementTravail: [
          'Agences de communication et digitales',
          'Grandes entreprises en cours de digitalisation',
          'Startups en phase de croissance (scale-up).'
        ],
        tags: ['Agile', 'Scrum', 'Gestion de Produit', 'Stratégie']
      }
    ]
  },
  {
    id: 'finance-gestion',
    nom: 'Finance, Gestion & Comptabilité',
    description: "La colonne vertébrale de toute entreprise. Ces métiers garantissent la pérennité, la rentabilité et la conformité légale des activités économiques.",
    icone: '💰',
    couleur: '#52c41a',
    metiers: [
      {
        id: 'comptable',
        titre: 'Comptable (Général / Auxiliaire)',
        description: "Gardien de la fiabilité financière de l'entreprise, le comptable enregistre et centralise toutes les données commerciales et financières. Au Sénégal, la maîtrise du plan SYSCOHADA Révisé est impérative.",
        secteur: 'finance-gestion',
        missions: [
          "Tenue de la comptabilité générale (clients, fournisseurs, trésorerie).",
          "Établissement des déclarations fiscales (TVA, IS) et sociales (cotisations IPRES, CSS).",
          "Participation à la préparation du bilan et du compte de résultat.",
          "Suivi des immobilisations et des stocks.",
          "Lettrage et justification des comptes."
        ],
        competencesRequises: [
          { nom: 'Maîtrise des normes comptables SYSCOHADA', niveau: 'expert' },
          { nom: 'Logiciels comptables (Sage, Odoo, Tomate)', niveau: 'avancé' },
          { nom: 'Fiscalité sénégalaise des entreprises', niveau: 'avancé' },
          { nom: 'Rigueur, organisation et respect des délais', niveau: 'expert' },
          { nom: 'Maîtrise d\'Excel (Tableaux Croisés Dynamiques, RechercheV)', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 250000, max: 400000 },
          confirme: { min: 400000, max: 750000 },
          senior: { min: 750000, max: 1400000 }
        },
        formation: [
          'BTS, DUT ou Licence en Comptabilité et Gestion (UCAD, UGB).',
          'Master CCA (Comptabilité, Contrôle, Audit).',
          'Diplômes de la filière expertise comptable (CRECF).'
        ],
        perspectives: [
          'Chef comptable',
          'Contrôleur de gestion',
          'Responsable Administratif et Financier (RAF) dans une PME.'
        ],
        environnementTravail: [
          'PME-PMI de tous les secteurs',
          'Cabinets d\'expertise comptable et d\'audit',
          'Filiales de groupes internationaux.'
        ],
        tags: ['Comptabilité', 'Fiscalité', 'SYSCOHADA', 'Gestion']
      },
      {
        id: 'controleur-gestion',
        titre: 'Contrôleur de Gestion',
        description: "Business partner de la direction, il fournit les outils de pilotage pour améliorer la performance de l'entreprise. Il analyse les coûts, établit les budgets et s'assure que l'entreprise tient le cap sur ses objectifs.",
        secteur: 'finance-gestion',
        missions: [
          "Élaborer le processus budgétaire et les prévisions (forecasts).",
          "Mettre en place et suivre les tableaux de bord et les KPIs.",
          "Analyser les écarts entre le réel et le prévisionnel, et proposer des actions correctives.",
          "Calculer les coûts de revient et analyser la rentabilité par produit/client.",
          "Participer aux projets d'optimisation des processus."
        ],
        competencesRequises: [
          { nom: 'Analyse financière et modélisation sur Excel/Power BI', niveau: 'expert' },
          { nom: 'Connaissance des systèmes d\'information (ERP)', niveau: 'avancé' },
          { nom: 'Vision stratégique et forte capacité d\'analyse', niveau: 'expert' },
          { nom: 'Excellente communication pour interagir avec les managers', niveau: 'avancé' },
          { nom: 'Comptabilité analytique', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 450000, max: 700000 },
          confirme: { min: 700000, max: 1300000 },
          senior: { min: 1300000, max: 2500000 }
        },
        formation: [
          'Master en Contrôle de Gestion, Audit ou Finance (CESAG, ISM).',
          'École de Commerce avec spécialisation finance d\'entreprise.',
          'Diplôme d\'ingénieur complété par une formation en gestion.'
        ],
        perspectives: [
          'Responsable du contrôle de gestion',
          'Directeur Administratif et Financier (DAF)',
          'Consultant en amélioration de la performance.'
        ],
        environnementTravail: [
          'Secteur industriel (agro-alimentaire, cimenteries)',
          'Grande distribution (Auchan, Carrefour)',
          'Secteur des services (télécoms, banques).'
        ],
        tags: ['Finance', 'Pilotage', 'Performance', 'Budget', 'KPIs']
      },
      {
        id: 'auditeur-financier',
        titre: 'Auditeur Financier (Interne / Externe)',
        description: "L'auditeur est le garant de la régularité et de la sincérité des comptes de l'entreprise. En externe (cabinet), il certifie les comptes. En interne, il s'assure que les procédures de contrôle sont efficaces pour maîtriser les risques.",
        secteur: 'finance-gestion',
        missions: [
          "Planifier et réaliser des missions d'audit des états financiers.",
          "Évaluer les procédures de contrôle interne.",
          "Identifier les zones de risque et les anomalies comptables.",
          "Rédiger des rapports d'audit avec des recommandations claires.",
          "S'assurer de la conformité avec les normes locales et internationales (IFRS)."
        ],
        competencesRequises: [
          { nom: 'Techniques d\'audit et normes professionnelles', niveau: 'expert' },
          { nom: 'Analyse financière approfondie', niveau: 'expert' },
          { nom: 'Esprit critique, curiosité et scepticisme professionnel', niveau: 'expert' },
          { nom: 'Excellentes capacités rédactionnelles et relationnelles', niveau: 'avancé' },
          { nom: 'Intégrité et éthique irréprochables', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 650000 },
          confirme: { min: 650000, max: 1200000 },
          senior: { min: 1200000, max: 2200000 }
        },
        formation: [
          'Master CCA ou spécialisé en Audit.',
          'École de commerce ou diplôme d\'expertise comptable.',
          'Certifications comme le CIA (Certified Internal Auditor) sont un plus.'
        ],
        perspectives: [
          'Manager en cabinet d\'audit (Big Four)',
          'Responsable de l\'audit interne dans un grand groupe',
          'Évolution vers des postes de Direction Financière.'
        ],
        environnementTravail: [
          'Cabinets d\'audit et de conseil (Deloitte, PwC, EY, KPMG)',
          'Grandes entreprises et banques (audit interne)',
          'Organismes de régulation.'
        ],
        tags: ['Audit', 'Contrôle Interne', 'Risques', 'Conformité', 'IFRS']
      }
    ]
  },
  {
    id: 'marketing-vente',
    nom: 'Marketing, Vente & Communication',
    description: "Les métiers au contact du client, essentiels pour développer le chiffre d'affaires et construire une image de marque forte et reconnue.",
    icone: '📈',
    couleur: '#faad14',
    metiers: [
      {
        id: 'commercial-terrain',
        titre: 'Commercial Terrain / Business Developer',
        description: "En première ligne pour la croissance de l'entreprise, le commercial développe et fidélise un portefeuille de clients. C'est un rôle qui exige de l'endurance, un excellent relationnel et une forte orientation résultat.",
        secteur: 'marketing-vente',
        missions: [
          "Prospecter de nouveaux clients (phoning, mailing, porte-à-porte).",
          "Présenter les produits/services et argumenter pour convaincre.",
          "Négocier les contrats et les conditions de vente.",
          "Assurer le suivi des clients existants et la fidélisation.",
          "Réaliser un reporting régulier de son activité commerciale."
        ],
        competencesRequises: [
          { nom: 'Techniques de vente et de négociation', niveau: 'expert' },
          { nom: 'Excellente connaissance des produits/services', niveau: 'expert' },
          { nom: 'Ténacité, persévérance et forte résistance à l\'échec', niveau: 'expert' },
          { nom: 'Qualités relationnelles et sens de l\'écoute', niveau: 'avancé' },
          { nom: 'Autonomie et organisation', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 150000, max: 300000 },
          confirme: { min: 300000, max: 600000 },
          senior: { min: 600000, max: 1200000 }
        },
        formation: [
          'BTS/DUT en Techniques de Commercialisation.',
          'Licence ou Master en Vente, Négociation ou Commerce.',
          'Toutes formations si la personnalité et le tempérament commercial sont présents.'
        ],
        perspectives: [
          'Chef des ventes / Responsable commercial',
          'Key Account Manager (Responsable grands comptes)',
          'Directeur commercial.'
        ],
        environnementTravail: [
          'Secteur de la distribution (FMCG)',
          'Télécoms et services financiers',
          'Secteur industriel et BTP.'
        ],
        tags: ['Vente', 'Négociation', 'Prospection', 'B2B', 'B2C']
      },
      {
        id: 'marketing-digital',
        titre: 'Spécialiste en Marketing Digital',
        description: "Ce professionnel utilise tous les leviers du web pour accroître la notoriété et les ventes de l'entreprise. Il jongle avec les réseaux sociaux, le référencement, la publicité en ligne et l'emailing pour toucher les bonnes cibles au bon moment.",
        secteur: 'marketing-vente',
        missions: [
          "Gérer et animer les réseaux sociaux (Facebook, Instagram, LinkedIn, TikTok).",
          "Mettre en place des campagnes de publicité en ligne (Google Ads, Facebook Ads).",
          "Optimiser le référencement naturel du site web (SEO).",
          "Créer et diffuser des campagnes d'emailing et des newsletters.",
          "Analyser les performances des actions marketing (Google Analytics) et ajuster la stratégie."
        ],
        competencesRequises: [
          { nom: 'Gestion des réseaux sociaux et des outils de sponsoring', niveau: 'expert' },
          { nom: 'SEO/SEM (Référencement naturel et payant)', niveau: 'avancé' },
          { nom: 'Création de contenu (rédactionnel, visuel)', niveau: 'intermédiaire' },
          { nom: 'Analyse de données (Google Analytics)', niveau: 'avancé' },
          { nom: 'Créativité et curiosité', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 350000, max: 600000 },
          confirme: { min: 600000, max: 1000000 },
          senior: { min: 1000000, max: 1800000 }
        },
        formation: [
          'Licence/Master en Marketing Digital, Communication ou Webmarketing.',
          'École de commerce avec spécialisation digitale.',
          'Certifications Google, Facebook, Hubspot.'
        ],
        perspectives: [
          'Responsable Marketing Digital',
          'Social Media Manager',
          'Responsable Acquisition de trafic.'
        ],
        environnementTravail: [
          'Agences de communication',
          'Entreprises e-commerce',
          'PME souhaitant développer leur présence en ligne.'
        ],
        tags: ['Marketing Digital', 'SEO', 'SEA', 'Réseaux Sociaux', 'Content Marketing']
      }
    ]
  },
  {
    id: 'rh-legal',
    nom: 'Ressources Humaines & Juridique',
    description: "Les métiers qui placent l'humain et la loi au centre de l'entreprise, de l'embauche à la gestion des contrats.",
    icone: '👥',
    couleur: '#ff4d4f',
    metiers: [
      {
        id: 'responsable-rh',
        titre: 'Responsable des Ressources Humaines (RRH)',
        description: "Le RRH gère le capital humain de l'entreprise. Il s'occupe du recrutement, de la formation, de la gestion des carrières, de la paie et des relations sociales, en veillant au respect du droit du travail sénégalais.",
        secteur: 'rh-legal',
        missions: [
            "Définir et piloter la stratégie de recrutement.",
            "Élaborer le plan de formation et suivre son exécution.",
            "Gérer l'administration du personnel (contrats, paie, congés).",
            "Animer le dialogue avec les représentants du personnel.",
            "Conseiller les managers sur les questions RH."
        ],
        competencesRequises: [
            { nom: "Droit du travail sénégalais", niveau: 'expert' },
            { nom: "Techniques de recrutement et d'entretien", niveau: 'avancé' },
            { nom: "Ingénierie de la formation", niveau: 'avancé' },
            { nom: "Gestion de la paie", niveau: 'intermédiaire' },
            { nom: "Écoute, diplomatie et sens de la confidentialité", niveau: 'expert' }
        ],
        salaireMoyen: {
            junior: { min: 400000, max: 700000 },
            confirme: { min: 700000, max: 1400000 },
            senior: { min: 1400000, max: 2500000 }
        },
        formation: [
            "Master en Gestion des Ressources Humaines.",
            "École de commerce avec spécialisation RH.",
            "Master en Droit Social."
        ],
        perspectives: [
            "Directeur des Ressources Humaines (DRH)",
            "Consultant RH",
            "Responsable des relations sociales."
        ],
        environnementTravail: [
            "PME et grandes entreprises de tous secteurs",
            "Cabinets de recrutement",
            "Secteur public et parapublic."
        ],
        tags: ['RH', 'Recrutement', 'Droit Social', 'Formation', 'Paie']
      }
    ]
  }
];

const CareersPage: React.FC = () => {
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetier, setSelectedMetier] = useState<FicheMetier | null>(null);
  const [forceShow, setForceShow] = useState(false);
  const isPremium = hasPremiumAccess(user, hasActiveSubscription);

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
      {!isPremium && (
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