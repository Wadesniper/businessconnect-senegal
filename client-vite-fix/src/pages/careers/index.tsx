import React, { useState, useMemo, useEffect } from 'react';
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
        id: 'mobile-dev',
        titre: 'Développeur Mobile (Android/iOS)',
        description: "Spécialiste de la création d'applications pour smartphones et tablettes. Au Sénégal, avec la pénétration massive du mobile, ce rôle est clé pour les services financiers (Wave), les plateformes de livraison et les médias.",
        secteur: 'tech',
        missions: [
          "Développer des applications natives (Kotlin/Java pour Android, Swift pour iOS) ou cross-platform (React Native, Flutter).",
          "Optimiser les applications pour une performance et une consommation de batterie maximales.",
          "Assurer une expérience utilisateur (UX) fluide et intuitive, adaptée aux spécificités du mobile.",
          "Gérer la publication et les mises à jour sur le Google Play Store et l'Apple App Store.",
          "Intégrer des notifications push et des services de géolocalisation."
        ],
        competencesRequises: [
          { nom: 'Kotlin/Java (Android) ou Swift (iOS)', niveau: 'expert' },
          { nom: 'Flutter ou React Native', niveau: 'avancé' },
          { nom: 'API REST et gestion des données hors-ligne', niveau: 'avancé' },
          { nom: 'Principes de design mobile (Material Design, Human Interface Guidelines)', niveau: 'intermédiaire' },
          { nom: 'Git', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 750000 },
          confirme: { min: 750000, max: 1400000 },
          senior: { min: 1400000, max: 2600000 }
        },
        formation: [
          'Bac+3 à Bac+5 en Informatique.',
          'Formations en ligne et certifications spécifiques (Google, Apple).',
          'Portfolio de projets personnels ou professionnels (très important).'
        ],
        perspectives: [
          'Lead Mobile Developer',
          'Architecte Mobile',
          'Chef de projet mobile.'
        ],
        environnementTravail: [
          'Startups et Fintech',
          'Agences de développement mobile',
          'Grandes entreprises avec une stratégie "mobile-first".'
        ],
        tags: ['Mobile', 'Android', 'iOS', 'Flutter', 'React Native']
      },
      {
        id: 'cloud-architect',
        titre: 'Architecte Cloud',
        description: "Responsable de la stratégie et de l'infrastructure cloud d'une entreprise. Il conçoit des architectures robustes, scalables et sécurisées sur des plateformes comme AWS, Azure ou Google Cloud pour héberger les applications et services.",
        secteur: 'tech',
        missions: [
          "Concevoir et déployer des architectures cloud en fonction des besoins métiers.",
          "Gérer la migration d'infrastructures existantes (on-premise) vers le cloud.",
          "Optimiser les coûts liés à l'utilisation des services cloud (FinOps).",
          "Mettre en place les politiques de sécurité et de conformité dans le cloud.",
          "Collaborer avec les équipes DevOps pour automatiser le déploiement et la gestion de l'infrastructure."
        ],
        competencesRequises: [
          { nom: 'Plateformes Cloud (AWS, Azure, GCP)', niveau: 'expert' },
          { nom: 'Infrastructure as Code (Terraform, CloudFormation)', niveau: 'avancé' },
          { nom: 'Conteneurisation (Docker, Kubernetes)', niveau: 'avancé' },
          { nom: 'Sécurité Cloud et gestion des identités (IAM)', niveau: 'expert' },
          { nom: 'Réseaux et architectures distribuées', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1500000 },
          confirme: { min: 1500000, max: 2800000 },
          senior: { min: 2800000, max: 4500000 }
        },
        formation: [
          'Ingénieur en informatique ou systèmes et réseaux.',
          'Certifications professionnelles des fournisseurs cloud (ex: AWS Certified Solutions Architect).',
          'Forte expérience en administration système ou DevOps.'
        ],
        perspectives: [
          'Chief Technology Officer (CTO)',
          'Consultant Cloud senior',
          'Architecte d\'entreprise.'
        ],
        environnementTravail: [
          'Grandes entreprises en transformation digitale',
          'ESN et cabinets de conseil spécialisés',
          'Acteurs majeurs du web et de la tech.'
        ],
        tags: ['Cloud', 'Architecture', 'AWS', 'Azure', 'DevOps']
      },
      {
        id: 'ia-engineer',
        titre: 'Ingénieur IA / Machine Learning',
        description: "L'ingénieur IA construit et déploie des modèles d'intelligence artificielle pour résoudre des problèmes concrets. Il va au-delà de l'analyse du Data Scientist pour créer des produits et services intelligents (reconnaissance d'image, NLP, etc.).",
        secteur: 'tech',
        missions: [
          "Industrialiser et mettre en production les modèles de Machine Learning (MLOps).",
          "Développer des APIs pour exposer les modèles d'IA à d'autres applications.",
          "Optimiser les algorithmes pour la performance et le passage à l'échelle (scalability).",
          "Travailler sur des problématiques complexes comme le traitement du langage naturel (NLP) ou la vision par ordinateur.",
          "Assurer la maintenance et la surveillance des modèles en production."
        ],
        competencesRequises: [
          { nom: 'Frameworks de Deep Learning (TensorFlow, PyTorch)', niveau: 'expert' },
          { nom: 'Langages de programmation (Python, C++)', niveau: 'expert' },
          { nom: 'Plateformes Cloud pour l\'IA (SageMaker, Azure ML)', niveau: 'avancé' },
          { nom: 'MLOps (outils comme MLflow, Kubeflow)', niveau: 'avancé' },
          { nom: 'Bases de données et ingénierie des données', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1300000 },
          confirme: { min: 1300000, max: 2500000 },
          senior: { min: 2500000, max: 4500000 }
        },
        formation: [
          'Master ou diplôme d\'ingénieur en Informatique avec spécialisation IA.',
          'Doctorat en IA, Machine Learning ou domaines connexes.',
          'Expérience solide en développement logiciel.'
        ],
        perspectives: [
          'Lead AI Engineer',
          'Architecte IA',
          'Chercheur en IA appliquée.'
        ],
        environnementTravail: [
          'Centres de R&D de grands groupes',
          'Startups spécialisées en IA',
          'Géants de la technologie.'
        ],
        tags: ['IA', 'Machine Learning', 'Deep Learning', 'MLOps']
      },
      {
        id: 'devops-engineer',
        titre: 'Ingénieur DevOps',
        description: "L'ingénieur DevOps est un pont entre le développement (Dev) et l'exploitation (Ops). Son but est d'automatiser et de fluidifier le cycle de vie des applications, de l'écriture du code jusqu'à la mise en production et la surveillance.",
        secteur: 'tech',
        missions: [
          "Mettre en place et gérer des pipelines d'intégration et de déploiement continus (CI/CD).",
          "Gérer l'infrastructure en tant que code (IaC) avec des outils comme Terraform ou Ansible.",
          "Administrer les plateformes de conteneurisation (Docker, Kubernetes).",
          "Mettre en place des outils de monitoring, de logging et d'alerting (Prometheus, Grafana, ELK).",
          "Promouvoir la culture DevOps et collaborer étroitement avec les développeurs et les administrateurs système."
        ],
        competencesRequises: [
          { nom: 'Outils CI/CD (Jenkins, GitLab CI, GitHub Actions)', niveau: 'expert' },
          { nom: 'Docker et Kubernetes', niveau: 'expert' },
          { nom: 'Fournisseurs Cloud (AWS, Azure, GCP)', niveau: 'avancé' },
          { nom: 'Scripting (Bash, Python, Go)', niveau: 'expert' },
          { nom: 'Monitoring et observabilité', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1100000 },
          confirme: { min: 1100000, max: 2200000 },
          senior: { min: 2200000, max: 3800000 }
        },
        formation: [
          'Diplôme d\'ingénieur ou Master en informatique.',
          'Forte expérience en développement ou en administration système.',
          'Certifications (ex: Certified Kubernetes Administrator, AWS DevOps Engineer).'
        ],
        perspectives: [
          'Lead DevOps',
          'Architecte Cloud/Infrastructure',
          'Site Reliability Engineer (SRE).'
        ],
        environnementTravail: [
          'Startups et Scale-ups (essentiel pour leur croissance)',
          'ESN accompagnant la transformation des clients',
          'Grandes entreprises modernisant leur SI.'
        ],
        tags: ['DevOps', 'CI/CD', 'Kubernetes', 'Automatisation', 'Cloud']
      },
      {
        id: 'sre-engineer',
        titre: 'Ingénieur SRE (Site Reliability Engineering)',
        description: "L'ingénieur SRE applique les principes du génie logiciel aux problématiques d'infrastructure et d'opérations. Son objectif principal est de créer des systèmes ultra-fiables et scalables, en automatisant au maximum les tâches manuelles.",
        secteur: 'tech',
        missions: [
          "Définir des objectifs de niveau de service (SLO) et des budgets d'erreur (error budgets).",
          "Développer des solutions d'automatisation pour réduire la charge opérationnelle (toil).",
          "Mener des post-mortems d'incidents sans blâme pour en tirer des leçons.",
          "Améliorer le monitoring et l'observabilité pour détecter les problèmes de manière proactive.",
          "Participer à la conception de nouvelles fonctionnalités pour s'assurer de leur fiabilité dès le départ."
        ],
        competencesRequises: [
          { nom: 'Compétences solides en développement (Go, Python, Java)', niveau: 'expert' },
          { nom: 'Connaissance approfondie des systèmes distribués', niveau: 'expert' },
          { nom: 'Monitoring, logging, et tracing', niveau: 'expert' },
          { nom: 'Automatisation d\'infrastructure (IaC)', niveau: 'avancé' },
          { nom: 'Gestion de la performance et des incidents', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1300000 },
          confirme: { min: 1300000, max: 2600000 },
          senior: { min: 2600000, max: 4500000 }
        },
        formation: [
          'Profils de développeurs expérimentés évoluant vers l\'infrastructure.',
          'Ingénieur en systèmes et réseaux avec de fortes compétences en programmation.',
          'Le SRE est souvent une évolution de carrière pour des profils DevOps seniors.'
        ],
        perspectives: [
          'Lead SRE / SRE Manager',
          'Architecte de systèmes distribués',
          'Principal Engineer.'
        ],
        environnementTravail: [
          'Grandes entreprises du web (GAFAM, etc.)',
          'Plateformes à très fort trafic (Fintech, E-commerce)',
          'Entreprises avec des enjeux critiques de disponibilité.'
        ],
        tags: ['SRE', 'Fiabilité', 'Scalabilité', 'Automatisation', 'DevOps']
      }
    ]
  },
  {
    id: 'finance',
    nom: 'Finance & Banque',
    description: "Les métiers de la finance, de la banque et de l'assurance au Sénégal connaissent une transformation rapide, tirée par la digitalisation et l'inclusion financière. Le secteur offre des carrières solides au sein de banques panafricaines, de compagnies d'assurance, de microfinances et de startups Fintech en plein essor.",
    icone: '💰',
    couleur: '#f5c41a',
    metiers: [
      {
        id: 'analyste-financier',
        titre: 'Analyste Financier',
        description: "Acteur clé de la prise de décision, l'analyste financier évalue la santé financière des entreprises, des projets ou des marchés pour guider les stratégies d'investissement. Au Sénégal, ce rôle est crucial pour les banques d'affaires, les sociétés de gestion d'actifs et les grandes entreprises.",
        secteur: 'finance',
        missions: [
          "Analyser les états financiers (bilan, compte de résultat, tableau de flux de trésorerie).",
          "Construire des modèles financiers complexes pour la valorisation d'entreprises (DCF, multiples).",
          "Rédiger des rapports d'analyse et des recommandations d'investissement (acheter, vendre, conserver).",
          "Suivre l'actualité économique et financière du marché sénégalais et de la zone UEMOA.",
          "Participer à des opérations de haut de bilan (fusions-acquisitions, levées de fonds)."
        ],
        competencesRequises: [
          { nom: 'Modélisation financière (Excel, VBA)', niveau: 'expert' },
          { nom: 'Analyse comptable et financière (normes SYSCOHADA, IFRS)', niveau: 'expert' },
          { nom: 'Connaissance des marchés financiers et des produits de placement', niveau: 'avancé' },
          { nom: 'Maîtrise des outils de data (Bloomberg, Reuters, Capital IQ)', niveau: 'intermédiaire' },
          { nom: 'Anglais des affaires', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1000000 },
          confirme: { min: 1000000, max: 2500000 },
          senior: { min: 2500000, max: 5000000 }
        },
        formation: [
          "Master en Finance, Ingénierie Financière, Comptabilité Contrôle Audit (CCA).",
          "Écoles de commerce prestigieuses (BEM Dakar, ISM, etc.).",
          "Les certifications professionnelles (CFA, FRM) sont un atout majeur."
        ],
        perspectives: [
          "Gestionnaire de portefeuille (Portfolio Manager)",
          "Analyste Buy-Side / Sell-Side",
          "Consultant en stratégie financière",
          "Directeur Financier (CFO) à terme."
        ],
        environnementTravail: [
          "Banques d'investissement et d'affaires",
          "Sociétés de gestion d'actifs (Asset Management)",
          "Cabinets d'audit et de conseil (Big Four)",
          "Grandes entreprises et multinationales."
        ],
        tags: ['Finance', 'Investissement', 'Analyse', 'Marchés', 'Valorisation']
      },
      {
        id: 'expert-comptable',
        titre: 'Expert-Comptable',
        description: "Garant de la fiabilité des comptes de l'entreprise, l'expert-comptable est un partenaire stratégique du dirigeant. Sa mission va de la tenue de la comptabilité à l'optimisation fiscale et au conseil en gestion. La profession est réglementée par l'ONECCA au Sénégal.",
        secteur: 'finance',
        missions: [
          "Superviser et valider les comptes annuels (bilan, liasse fiscale).",
          "Réaliser des missions d'audit légal (commissariat aux comptes) ou contractuel.",
          "Conseiller les entreprises sur les aspects fiscaux, sociaux et juridiques.",
          "Établir des prévisionnels financiers et des business plans.",
          "Accompagner les entreprises dans leur transformation numérique (dématérialisation, etc.)."
        ],
        competencesRequises: [
          { nom: 'Maîtrise du référentiel SYSCOHADA Révisé', niveau: 'expert' },
          { nom: 'Droit fiscal et social sénégalais', niveau: 'expert' },
          { nom: 'Logiciels comptables et de paie (Sage, Odoo, etc.)', niveau: 'avancé' },
          { nom: 'Audit comptable et financier', niveau: 'avancé' },
          { nom: 'Qualités de conseil et de communication', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 900000 },
          confirme: { min: 900000, max: 2000000 },
          senior: { min: 2000000, max: 4000000 }
        },
        formation: [
          "Diplôme d'Expertise Comptable et Financière (DECOFI) de l'UEMOA, préparé via l'ONECCA.",
          "Master CCA (Comptabilité, Contrôle, Audit)."
        ],
        perspectives: [
          "S'associer au sein d'un cabinet d'expertise comptable.",
          "Créer son propre cabinet.",
          "Devenir Directeur Administratif et Financier (DAF) en entreprise."
        ],
        environnementTravail: [
          "Cabinets d'expertise comptable et d'audit (des Big Four aux petites structures).",
          "Direction financière de PME ou de grands groupes.",
          "Exercice en libéral."
        ],
        tags: ['Comptabilité', 'Finance', 'Fiscalité', 'Audit', 'Conseil']
      },
      {
        id: 'risk-manager',
        titre: 'Risk Manager / Gestionnaire de Risques',
        description: "Le Risk Manager a pour mission d'identifier, d'analyser et de maîtriser l'ensemble des risques (financiers, opérationnels, de conformité) qui pourraient affecter l'entreprise. Un rôle essentiel dans le secteur bancaire et de l'assurance, régulé par la BCEAO et la CIMA.",
        secteur: 'finance',
        missions: [
          "Élaborer la cartographie des risques de l'entreprise.",
          "Mettre en place des politiques et des procédures de gestion des risques.",
          "Quantifier les risques de marché, de crédit et opérationnels (modèles VaR, Stress Tests).",
          "Assurer la veille réglementaire (Bâle III, IFRS 9, Solvabilité II).",
          "Rédiger des rapports de risques pour la direction générale et les régulateurs."
        ],
        competencesRequises: [
          { nom: 'Connaissance des réglementations prudentielles (BCEAO, CIMA)', niveau: 'expert' },
          { nom: 'Modélisation statistique et quantitative des risques', niveau: 'avancé' },
          { nom: 'Maîtrise des normes de contrôle interne (COSO)', niveau: 'avancé' },
          { nom: 'Capacité d\'analyse et de synthèse', niveau: 'expert' },
          { nom: 'Anglais courant', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1200000 },
          confirme: { min: 1200000, max: 2800000 },
          senior: { min: 2800000, max: 6000000 }
        },
        formation: [
          "Master spécialisé en gestion des risques, actuariat ou finance.",
          "Diplôme d'ingénieur ou d'école de commerce avec une spécialisation finance.",
          "Certifications comme le FRM (Financial Risk Manager) sont très appréciées."
        ],
        perspectives: [
          "Chief Risk Officer (CRO)",
          "Directeur de l'audit interne ou de la conformité",
          "Consultant en gestion des risques"
        ],
        environnementTravail: [
          "Banques et établissements de crédit",
          "Compagnies d'assurance et de réassurance",
          "Grandes entreprises industrielles ou de services",
          "Cabinets de conseil spécialisés."
        ],
        tags: ['Risques', 'Finance', 'Conformité', 'Réglementation', 'Audit']
      },
      {
        id: 'product-manager-fintech',
        titre: 'Product Manager Fintech',
        description: "À la croisée de la finance, de la technologie et de l'expérience utilisateur, le Product Manager Fintech conçoit et gère le cycle de vie des produits financiers digitaux (applications de paiement, plateformes de prêt, etc.). C'est un métier phare de l'écosystème tech sénégalais.",
        secteur: 'finance',
        missions: [
          "Identifier les besoins des utilisateurs et les opportunités du marché (veille concurrentielle).",
          "Définir la vision et la roadmap du produit.",
          "Rédiger les spécifications fonctionnelles (user stories) et prioriser le backlog.",
          "Collaborer étroitement avec les équipes de développement (développeurs, designers UX/UI) en méthode Agile.",
          "Analyser les KPIs du produit (acquisition, rétention, monétisation) et itérer."
        ],
        competencesRequises: [
          { nom: 'Méthodologies agiles (Scrum, Kanban)', niveau: 'expert' },
          { nom: 'Compréhension des enjeux du Mobile Money et des paiements digitaux en Afrique', niveau: 'expert' },
          { nom: 'Gestion de produit (Roadmap, Backlog, A/B Testing)', niveau: 'avancé' },
          { nom: 'Conception UX/UI (wireframing, prototypage)', niveau: 'intermédiaire' },
          { nom: 'Analyse de données (Data-driven decisions)', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1500000 },
          confirme: { min: 1500000, max: 3000000 },
          senior: { min: 3000000, max: 5000000 }
        },
        formation: [
          "Double cursus ingénieur / école de commerce est idéal.",
          "Master en management de l'innovation, marketing digital ou gestion de projet.",
          "Expérience préalable dans une startup technologique ou une institution financière est souvent requise."
        ],
        perspectives: [
          "Head of Product / CPO (Chief Product Officer)",
          "Lancer sa propre startup Fintech",
          "Évoluer vers des postes de direction générale"
        ],
        environnementTravail: [
          "Startups Fintech (Wave, InTouch, etc.)",
          "Banques et assurances dans leurs départements de transformation digitale",
          "Opérateurs télécoms (Orange Money, Free Money)"
        ],
        tags: ['Fintech', 'Product', 'Innovation', 'Mobile Money', 'Agile']
      }
    ]
  },
  {
    id: 'sante',
    nom: 'Santé & Médical',
    description: "Le secteur de la santé au Sénégal est en pleine structuration, avec des investissements importants dans les infrastructures hospitalières et la formation. La demande pour des professionnels qualifiés est forte, tant dans le secteur public que privé, avec des enjeux majeurs de santé publique et de couverture médicale universelle (CMU).",
    icone: '⚕️',
    couleur: '#ff4d4f',
    metiers: [
      {
        id: 'medecin-generaliste',
        titre: 'Médecin Généraliste',
        description: "En première ligne du système de santé, le médecin généraliste assure le diagnostic, le traitement des maladies courantes et le suivi à long terme des patients. Il joue un rôle essentiel dans la prévention et l'orientation vers les spécialistes.",
        secteur: 'sante',
        missions: [
          "Mener des consultations de médecine générale (anamnèse, examen clinique).",
          "Prescrire des traitements médicamenteux et des examens complémentaires.",
          "Assurer le suivi des maladies chroniques (diabète, HTA) et la vaccination.",
          "Participer à des campagnes de santé publique et de prévention.",
          "Gérer le dossier médical des patients."
        ],
        competencesRequises: [
          { nom: 'Connaissances médicales générales solides', niveau: 'expert' },
          { nom: 'Capacité de diagnostic clinique', niveau: 'expert' },
          { nom: 'Excellentes qualités d\'écoute et d\'empathie', niveau: 'expert' },
          { nom: 'Gestion de l\'urgence médicale', niveau: 'avancé' },
          { nom: 'Connaissance du système de santé sénégalais', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1200000 },
          confirme: { min: 1200000, max: 2500000 },
          senior: { min: 2500000, max: 4500000 }
        },
        formation: [
          "Doctorat d'État en Médecine, délivré par une faculté de médecine (UCAD, UGB, etc.).",
          "Inscription à l'Ordre National des Médecins du Sénégal."
        ],
        perspectives: [
          "Spécialisation via l'internat ou le résidanat (cardiologie, pédiatrie, etc.).",
          "Ouvrir son propre cabinet médical.",
          "Carrière en santé publique ou dans l'humanitaire.",
          "Direction d'un centre de santé ou d'un district sanitaire."
        ],
        environnementTravail: [
          "Hôpitaux publics et privés",
          "Postes et centres de santé",
          "Cabinets médicaux libéraux",
          "ONG et organisations internationales."
        ],
        tags: ['Médecine', 'Soins', 'Santé publique', 'Diagnostic', 'Prévention']
      },
      {
        id: 'pharmacien',
        titre: 'Pharmacien Clinicien',
        description: "Le pharmacien est le spécialiste du médicament. Au-delà de la dispensation en officine, il joue un rôle de plus en plus clinique dans les établissements de santé, assurant le bon usage des médicaments et la pharmacovigilance.",
        secteur: 'sante',
        missions: [
          "Analyser les prescriptions médicales et délivrer les médicaments.",
          "Conseiller les patients sur le bon usage des traitements et les effets secondaires.",
          "Gérer les stocks de médicaments et de dispositifs médicaux.",
          "Participer à la pharmacovigilance (déclaration des effets indésirables).",
          "Réaliser des préparations magistrales."
        ],
        competencesRequises: [
          { nom: 'Pharmacologie et connaissances thérapeutiques', niveau: 'expert' },
          { nom: 'Législation pharmaceutique sénégalaise', niveau: 'expert' },
          { nom: 'Gestion des stocks et logistique', niveau: 'avancé' },
          { nom: 'Bonnes pratiques de dispensation', niveau: 'expert' },
          { nom: 'Conseil et communication patient', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 3500000 }
        },
        formation: [
          "Doctorat d'État en Pharmacie.",
          "Inscription à l'Ordre National des Pharmaciens du Sénégal."
        ],
        perspectives: [
          "Spécialisation (biologie médicale, pharmacie hospitalière).",
          "Devenir propriétaire d'une officine.",
          "Carrière dans l'industrie pharmaceutique (affaires réglementaires, marketing).",
          "Intégrer les corps de pharmaciens-inspecteurs de la santé publique."
        ],
        environnementTravail: [
          "Pharmacies d'officine (privées)",
          "Pharmacies à usage intérieur (PUI) dans les hôpitaux et cliniques",
          "Industrie pharmaceutique",
          "Grossistes-répartiteurs."
        ],
        tags: ['Santé', 'Pharmacie', 'Clinique', 'Médicament', 'Conseil']
      },
      {
        id: 'infirmier',
        titre: 'Infirmier Spécialisé',
        description: "Pilier des équipes de soins, l'infirmier dispense les soins prescrits par le médecin, surveille l'état de santé des patients et assure leur confort. Les spécialisations (anesthésie-réanimation, bloc opératoire, pédiatrie) sont très recherchées.",
        secteur: 'sante',
        missions: [
          "Réaliser les soins infirmiers (pansements, injections, perfusions).",
          "Administrer les traitements et surveiller leur efficacité.",
          "Assurer la surveillance continue des patients (constantes vitales).",
          "Participer à l'éducation thérapeutique du patient et de sa famille.",
          "Travailler en collaboration avec les médecins et les aides-soignants."
        ],
        competencesRequises: [
          { nom: 'Maîtrise des techniques de soins infirmiers', niveau: 'expert' },
          { nom: 'Connaissance des protocoles d\'hygiène et d\'asepsie', niveau: 'expert' },
          { nom: 'Rigueur, organisation et gestion du stress', niveau: 'expert' },
          { nom: 'Compétences relationnelles et empathie', niveau: 'avancé' },
          { nom: 'Utilisation des outils informatiques de suivi des soins', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 250000, max: 450000 },
          confirme: { min: 450000, max: 700000 },
          senior: { min: 700000, max: 1200000 }
        },
        formation: [
          "Diplôme d'État d'Infirmier.",
          "Diplômes de spécialisation (Infirmier anesthésiste, IBODE, puériculture)."
        ],
        perspectives: [
          "Devenir cadre de santé ou infirmier en chef.",
          "Se spécialiser davantage ou se tourner vers la formation.",
          "Ouvrir un cabinet de soins infirmiers libéral.",
          "Intégrer des programmes de santé publique."
        ],
        environnementTravail: [
          "Hôpitaux et cliniques (tous services)",
          "Centres de santé",
          "Soins à domicile",
          "Médecine du travail, médecine scolaire."
        ],
        tags: ['Santé', 'Soins', 'Médical', 'Hôpital', 'Patient']
      },
      {
        id: 'chirurgien-specialiste',
        titre: 'Chirurgien Spécialiste',
        description: "Le chirurgien réalise des interventions chirurgicales pour traiter des maladies, des blessures ou des malformations. C'est une profession qui exige une haute technicité, une grande résistance au stress et de longues années d'études.",
        secteur: 'sante',
        missions: [
          "Poser l'indication opératoire lors de consultations pré-chirurgicales.",
          "Réaliser l'intervention chirurgicale en respectant des protocoles stricts.",
          "Assurer le suivi post-opératoire des patients, en collaboration avec les anesthésistes et les infirmiers.",
          "Participer aux gardes et astreintes.",
          "Se former continuellement aux nouvelles techniques chirurgicales."
        ],
        competencesRequises: [
          { nom: 'Maîtrise des techniques chirurgicales de sa spécialité', niveau: 'expert' },
          { nom: 'Excellente connaissance de l\'anatomie et de la physiologie', niveau: 'expert' },
          { nom: 'Grande dextérité manuelle et précision', niveau: 'expert' },
          { nom: 'Capacité à prendre des décisions rapides sous pression', niveau: 'expert' },
          { nom: 'Endurance physique et mentale', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 1500000, max: 3000000 },
          confirme: { min: 3000000, max: 6000000 },
          senior: { min: 6000000, max: 10000000 }
        },
        formation: [
          "Doctorat en médecine puis spécialisation via le concours de l'internat (5 à 6 ans supplémentaires).",
          "Spécialités : Chirurgie viscérale, orthopédique, urologie, neurochirurgie, etc."
        ],
        perspectives: [
          "Devenir chef de service hospitalier.",
          "Développer une activité libérale en clinique privée.",
          "Carrière hospitalo-universitaire (enseignement et recherche).",
          "Participer à des missions humanitaires."
        ],
        environnementTravail: [
          "Blocs opératoires des hôpitaux et cliniques.",
          "Services de chirurgie.",
          "Consultations externes."
        ],
        tags: ['Chirurgie', 'Médecine', 'Spécialisation', 'Bloc opératoire', 'Intervention']
      },
      {
        id: 'radiologue',
        titre: 'Radiologue',
        description: "Le médecin radiologue est spécialisé dans l'obtention et l'interprétation des images médicales (radiographie, échographie, scanner, IRM). Son rôle est fondamental dans le parcours de diagnostic des patients.",
        secteur: 'sante',
        missions: [
          "Superviser la réalisation des examens d'imagerie.",
          "Interpréter les images et rédiger un compte-rendu pour le médecin traitant.",
          "Réaliser des actes de radiologie interventionnelle (biopsies, drainages guidés par l'image).",
          "S'assurer du respect des règles de radioprotection pour le patient et le personnel.",
          "Participer aux staffs pluridisciplinaires pour discuter des cas patients."
        ],
        competencesRequises: [
          { nom: 'Connaissance approfondie des différentes techniques d\'imagerie', niveau: 'expert' },
          { nom: 'Solides compétences en sémiologie radiologique', niveau: 'expert' },
          { nom: 'Précision et rigueur dans l\'interprétation', niveau: 'expert' },
          { nom: 'Maîtrise des outils informatiques (PACS, RIS)', niveau: 'avancé' },
          { nom: 'Bonne communication avec les autres spécialistes', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 1200000, max: 2500000 },
          confirme: { min: 2500000, max: 5000000 },
          senior: { min: 5000000, max: 9000000 }
        },
        formation: [
          "Doctorat en médecine puis spécialisation en radiologie et imagerie médicale via l'internat."
        ],
        perspectives: [
          "S'installer en libéral et investir dans son propre plateau technique.",
          "Se sur-spécialiser (neuroradiologie, imagerie de la femme, etc.).",
          "Carrière hospitalo-universitaire.",
          "Développer la téléradiologie."
        ],
        environnementTravail: [
          "Cabinets de radiologie libéraux.",
          "Services d'imagerie médicale des hôpitaux et cliniques.",
          "Centres de dépistage."
        ],
        tags: ['Radiologie', 'Imagerie', 'Diagnostic', 'Scanner', 'IRM']
      },
      {
        id: 'kinesitherapeute',
        titre: 'Kinésithérapeute',
        description: "Le kinésithérapeute (ou masseur-kinésithérapeute) est le spécialiste de la rééducation fonctionnelle. Il intervient sur prescription médicale pour aider les patients à retrouver leurs capacités motrices après une blessure, une chirurgie ou une maladie.",
        secteur: 'sante',
        missions: [
          "Établir un bilan diagnostic kinésithérapique.",
          "Mettre en œuvre des techniques de rééducation (massages, mobilisations, renforcement musculaire).",
          "Utiliser des techniques de physiothérapie (ultrasons, électrothérapie).",
          "Éduquer le patient et lui apprendre des auto-exercices.",
          "Assurer la traçabilité des soins dans le dossier du patient."
        ],
        competencesRequises: [
          { nom: 'Connaissances en anatomie, physiologie et biomécanique', niveau: 'expert' },
          { nom: 'Maîtrise des techniques de masso-kinésithérapie', niveau: 'expert' },
          { nom: 'Qualités pédagogiques et patience', niveau: 'expert' },
          { nom: 'Bonne condition physique', niveau: 'avancé' },
          { nom: 'Écoute et sens du contact', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 300000, max: 500000 },
          confirme: { min: 500000, max: 800000 },
          senior: { min: 800000, max: 1500000 }
        },
        formation: [
          "Diplôme d'État de Masseur-Kinésithérapeute."
        ],
        perspectives: [
          "Ouvrir son propre cabinet de kinésithérapie.",
          "Se spécialiser (kiné du sport, respiratoire, pédiatrique, ostéopathie).",
          "Devenir cadre de santé dans un service de rééducation.",
          "Intervenir au sein de clubs sportifs."
        ],
        environnementTravail: [
          "Cabinets libéraux",
          "Centres de rééducation fonctionnelle",
          "Hôpitaux et cliniques",
          "Établissements pour personnes âgées (EHPAD)",
          "Clubs sportifs."
        ],
        tags: ['Rééducation', 'Sport', 'Santé', 'Kinésithérapie', 'Mouvement']
      }
    ]
  },
  {
    id: 'marketing',
    nom: 'Marketing & Communication',
    description: "Dans un marché sénégalais de plus en plus concurrentiel et digitalisé, les métiers du marketing et de la communication sont stratégiques. Les entreprises, des PME aux multinationales, investissent pour construire leur image de marque, acquérir et fidéliser leurs clients.",
    icone: '📢',
    couleur: '#722ed1',
    metiers: [
      {
        id: 'digital-marketer',
        titre: 'Digital Marketing Manager',
        description: "Orchestrateur de la stratégie digitale, le Digital Marketing Manager utilise tous les leviers numériques (SEO, SEA, Social Media, Emailing) pour atteindre les objectifs de notoriété, d'acquisition et de conversion de l'entreprise.",
        secteur: 'marketing',
        missions: [
          "Définir la stratégie de marketing digital et allouer les budgets.",
          "Piloter les campagnes d'acquisition de trafic payant (Google Ads, Social Ads).",
          "Optimiser le référencement naturel (SEO) du site web.",
          "Superviser la stratégie de contenu et le community management.",
          "Analyser la performance des actions via des outils comme Google Analytics et rapporter au management."
        ],
        competencesRequises: [
          { nom: 'Stratégie Marketing Digital 360°', niveau: 'expert' },
          { nom: 'Google Ads & Social Ads (Facebook, Instagram, LinkedIn)', niveau: 'expert' },
          { nom: 'SEO technique et de contenu', niveau: 'avancé' },
          { nom: 'Google Analytics et Data Studio', niveau: 'avancé' },
          { nom: 'Marketing Automation (ex: Mailchimp, Sendinblue)', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 700000 },
          confirme: { min: 700000, max: 1500000 },
          senior: { min: 1500000, max: 3000000 }
        },
        formation: [
          "Master en Marketing Digital, Communication ou E-commerce.",
          "École de commerce avec une spécialisation digitale.",
          "Les certifications (Google Ads, HubSpot, etc.) sont très valorisées."
        ],
        perspectives: [
          "Directeur Marketing (CMO)",
          "Head of Acquisition",
          "Consultant en stratégie digitale",
          "Lancer sa propre agence digitale."
        ],
        environnementTravail: [
          "Agences de communication et digitales",
          "Annonceurs (grandes entreprises, PME)",
          "Startups et entreprises e-commerce",
          "Freelance."
        ],
        tags: ['Digital', 'Marketing', 'Communication', 'Web', 'Stratégie']
      },
      {
        id: 'community-manager',
        titre: 'Community Manager',
        description: "Ambassadeur de la marque sur les réseaux sociaux, le Community Manager crée et anime une communauté engagée. Il est la voix de l'entreprise sur des plateformes comme Facebook, Instagram, Twitter, LinkedIn et même TikTok, très populaires au Sénégal.",
        secteur: 'marketing',
        missions: [
          "Élaborer le calendrier éditorial pour les différents réseaux sociaux.",
          "Créer et publier du contenu attractif (visuels, vidéos, stories, textes).",
          "Animer la communauté : répondre aux commentaires, messages privés, organiser des jeux-concours.",
          "Assurer la modération des commentaires et gérer les avis négatifs (e-réputation).",
          "Suivre les indicateurs de performance (engagement, portée, croissance de la communauté)."
        ],
        competencesRequises: [
          { nom: 'Excellente maîtrise des réseaux sociaux et de leurs codes', niveau: 'expert' },
          { nom: 'Créativité et compétences en création de contenu (Canva, Photoshop, outils de montage vidéo)', niveau: 'avancé' },
          { nom: 'Très bonnes capacités rédactionnelles (storytelling, copywriting)', niveau: 'expert' },
          { nom: 'Gestion de crise et e-réputation', niveau: 'intermédiaire' },
          { nom: 'Veille sur les tendances et les formats émergents', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 250000, max: 450000 },
          confirme: { min: 450000, max: 800000 },
          senior: { min: 800000, max: 1300000 }
        },
        formation: [
          "BTS ou Licence en Communication, Marketing.",
          "Formations spécialisées en community management.",
          "Un portfolio de pages gérées est souvent plus important que le diplôme."
        ],
        perspectives: [
          "Social Media Manager (plus stratégique)",
          "Content Manager",
          "Responsable de l'e-réputation."
        ],
        environnementTravail: [
          "Agences de communication",
          "Entreprises de tous secteurs",
          "Médias et personnalités publiques",
          "Freelance."
        ],
        tags: ['Social Media', 'Communication', 'Content', 'Community', 'E-réputation']
      },
      {
        id: 'brand-manager',
        titre: 'Chef de Marque / Brand Manager',
        description: "Le Brand Manager est le gardien de l'identité et de l'image d'une marque. Il s'assure de la cohérence de tous les points de contact avec le consommateur pour construire une marque forte et reconnue.",
        secteur: 'marketing',
        missions: [
          "Définir le positionnement et la plateforme de marque (mission, vision, valeurs).",
          "Développer et lancer de nouvelles offres ou produits.",
          "Piloter le plan de communication 360° (publicité, digital, relations presse, événements).",
          "Analyser les études de marché et la veille concurrentielle.",
          "Garantir la cohérence de l'identité visuelle et du discours de la marque."
        ],
        competencesRequises: [
          { nom: 'Gestion de marque (Branding)', niveau: 'expert' },
          { nom: 'Gestion de projet', niveau: 'expert' },
          { nom: 'Analyse de marché et études consommateurs', niveau: 'avancé' },
          { nom: 'Compétences budgétaires et analytiques', niveau: 'avancé' },
          { nom: 'Créativité et sens de l\'esthétique', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 900000 },
          confirme: { min: 900000, max: 1800000 },
          senior: { min: 1800000, max: 3500000 }
        },
        formation: [
          "Master d'une école de commerce ou d'un IAE avec spécialisation Marketing.",
          "Master en Communication, Publicité."
        ],
        perspectives: [
          "Directeur Marketing",
          "Directeur de la Communication",
          "Prendre la responsabilité d'un portefeuille de marques."
        ],
        environnementTravail: [
          "Grandes entreprises de biens de consommation (agroalimentaire, cosmétiques)",
          "Opérateurs de services (télécoms, banques)",
          "Agences de publicité et de branding."
        ],
        tags: ['Marketing', 'Branding', 'Stratégie', 'Publicité', 'Produit']
      }
    ]
  },
  {
    id: 'education',
    nom: 'Éducation & Formation',
    description: "Le secteur de l'éducation et de la formation au Sénégal est en pleine transformation numérique. Avec l'émergence des EdTech, la démocratisation de l'enseignement supérieur et l'importance croissante de la formation continue, les opportunités sont nombreuses pour les professionnels qualifiés.",
    icone: '📚',
    couleur: '#fa8c16',
    metiers: [
      {
        id: 'formateur-pro',
        titre: 'Formateur Professionnel',
        description: "Le Formateur Professionnel conçoit et anime des formations pour adultes dans divers domaines. Il adapte ses méthodes pédagogiques aux besoins spécifiques des apprenants et utilise les technologies modernes pour optimiser l'apprentissage.",
        secteur: 'education',
        missions: [
          "Analyser les besoins de formation et concevoir des programmes adaptés.",
          "Créer des supports pédagogiques variés (présentations, exercices, études de cas).",
          "Animer des sessions de formation en présentiel et/ou en distanciel.",
          "Évaluer les acquis des participants et ajuster les contenus.",
          "Assurer le suivi post-formation et mesurer l'impact sur les performances."
        ],
        competencesRequises: [
          { nom: 'Pédagogie pour adultes (andragogie)', niveau: 'expert' },
          { nom: 'Conception de formation et ingénierie pédagogique', niveau: 'expert' },
          { nom: 'Outils e-learning et plateformes LMS', niveau: 'avancé' },
          { nom: 'Animation de groupe et techniques de facilitation', niveau: 'expert' },
          { nom: 'Évaluation des apprentissages et mesure d\'impact', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 350000, max: 700000 },
          confirme: { min: 700000, max: 1400000 },
          senior: { min: 1400000, max: 2500000 }
        },
        formation: [
          "Master en Sciences de l'Éducation ou en Ingénierie de la Formation.",
          "Certification de formateur (ex: Certificat de Compétences en Formation d'Adultes).",
          "Expertise métier dans le domaine d'intervention (informatique, management, etc.)."
        ],
        perspectives: [
          "Responsable pédagogique ou Directeur de formation.",
          "Consultant en ingénierie de formation.",
          "Directeur de centre de formation ou d'école.",
          "Créer son propre organisme de formation."
        ],
        environnementTravail: [
          "Centres de formation professionnelle et organismes de formation.",
          "Services formation des entreprises.",
          "Écoles et universités (formation continue).",
          "Indépendant (freelance)."
        ],
        tags: ['Formation', 'Pédagogie', 'E-learning', 'Andragogie', 'Ingénierie']
      },
      {
        id: 'edtech-specialist',
        titre: 'Spécialiste EdTech',
        description: "Le Spécialiste EdTech développe et met en œuvre des solutions d'apprentissage numérique innovantes. Il combine expertise pédagogique et maîtrise des technologies pour créer des expériences d'apprentissage engageantes et efficaces.",
        secteur: 'education',
        missions: [
          "Concevoir et développer des plateformes d'apprentissage en ligne (LMS).",
          "Créer des contenus pédagogiques numériques (vidéos, modules interactifs, serious games).",
          "Intégrer les technologies émergentes (IA, VR/AR) dans les parcours de formation.",
          "Analyser les données d'apprentissage pour optimiser les contenus et parcours.",
          "Former les enseignants et formateurs aux outils numériques."
        ],
        competencesRequises: [
          { nom: 'Plateformes LMS (Moodle, Canvas, etc.) et outils e-learning', niveau: 'expert' },
          { nom: 'Pédagogie numérique et design d\'expérience d\'apprentissage', niveau: 'expert' },
          { nom: 'Production de contenus multimédia (vidéo, audio, infographies)', niveau: 'avancé' },
          { nom: 'Learning Analytics et mesure de l\'engagement', niveau: 'avancé' },
          { nom: 'Technologies émergentes (IA, VR/AR, chatbots)', niveau: 'intermédiaire' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 900000 },
          confirme: { min: 900000, max: 1800000 },
          senior: { min: 1800000, max: 3200000 }
        },
        formation: [
          "Master en EdTech, Ingénierie pédagogique ou Sciences de l'éducation.",
          "Formation en développement web et multimédia.",
          "Certifications e-learning (ex: Adobe Captivate, Articulate)."
        ],
        perspectives: [
          "Directeur digital learning ou Chief Learning Officer.",
          "Chef de projet EdTech ou Product Manager EdTech.",
          "Consultant e-learning et transformation digitale de la formation.",
          "Créer sa propre startup EdTech."
        ],
        environnementTravail: [
          "Startups EdTech et entreprises de formation digitale.",
          "Universités et établissements d'enseignement supérieur.",
          "Services formation des grandes entreprises.",
          "Agences de conseil en transformation digitale."
        ],
        tags: ['EdTech', 'Digital Learning', 'E-learning', 'Innovation', 'Pédagogie']
      },
      {
        id: 'conseiller-orientation',
        titre: 'Conseiller en Orientation Numérique',
        description: "Le Conseiller en Orientation Numérique guide les étudiants et professionnels dans leur parcours académique et professionnel en utilisant des outils digitaux avancés. Il aide à faire les bons choix de formation et de carrière.",
        secteur: 'education',
        missions: [
          "Accompagner individuellement les étudiants dans leur orientation scolaire et professionnelle.",
          "Utiliser des outils numériques d'évaluation des compétences et de personnalité.",
          "Organiser des ateliers de découverte des métiers et des formations.",
          "Maintenir une veille sur les évolutions du marché du travail et des formations.",
          "Collaborer avec les établissements et entreprises pour organiser des événements d'orientation."
        ],
        competencesRequises: [
          { nom: 'Conseil en orientation et psychologie de l\'orientation', niveau: 'expert' },
          { nom: 'Outils d\'évaluation numérique et plateformes d\'orientation', niveau: 'avancé' },
          { nom: 'Connaissance du système éducatif et des filières de formation', niveau: 'expert' },
          { nom: 'Digital coaching et accompagnement à distance', niveau: 'avancé' },
          { nom: 'Veille sur les métiers émergents et les compétences recherchées', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 350000, max: 700000 },
          confirme: { min: 700000, max: 1400000 },
          senior: { min: 1400000, max: 2500000 }
        },
        formation: [
          "Master en Orientation scolaire et professionnelle ou en Psychologie.",
          "Formation en coaching et accompagnement professionnel.",
          "Certification en outils d'évaluation et de bilan de compétences."
        ],
        perspectives: [
          "Directeur d'un service d'orientation ou d'un CIO.",
          "Coach carrière spécialisé en reconversion professionnelle.",
          "Consultant en orientation pour les entreprises et organisations.",
          "Créer son propre cabinet de conseil en orientation."
        ],
        environnementTravail: [
          "Établissements scolaires et universitaires (CIO, SCUIO).",
          "Centres d'information et d'orientation (CIO).",
          "Cabinets de conseil en orientation et coaching.",
          "Services RH des entreprises."
        ],
        tags: ['Orientation', 'Conseil', 'Coaching', 'Digital', 'Éducation']
      }
    ]
  },
  {
    id: 'construction',
    nom: 'Construction & BTP',
    description: "Le secteur du BTP au Sénégal est en pleine expansion grâce aux grands projets d'infrastructure (autoroutes, ponts, ports, aéroports) et au boom immobilier. Les entreprises locales et internationales recherchent des professionnels qualifiés pour répondre aux défis de la construction durable et de l'innovation technique.",
    icone: '🏗️',
    couleur: '#faad14',
    metiers: [
      {
        id: 'ingenieur-civil',
        titre: 'Ingénieur Génie Civil',
        description: "L'Ingénieur Génie Civil conçoit, supervise et réalise des projets de construction et d'infrastructure. Il assure la sécurité, la durabilité et la conformité des ouvrages tout en optimisant les coûts et les délais.",
        secteur: 'construction',
        missions: [
          "Concevoir et dimensionner des structures (bâtiments, ponts, routes, barrages).",
          "Superviser les études techniques et la préparation des dossiers d'exécution.",
          "Assurer le suivi de chantier et le contrôle qualité des travaux.",
          "Analyser les risques techniques et proposer des solutions d'optimisation.",
          "Coordonner les équipes techniques et les sous-traitants."
        ],
        competencesRequises: [
          { nom: 'Calcul de structures et résistance des matériaux', niveau: 'expert' },
          { nom: 'Logiciels de CAO/DAO (AutoCAD, Revit, Tekla)', niveau: 'expert' },
          { nom: 'Gestion de projet et planification de chantier', niveau: 'avancé' },
          { nom: 'Normes de construction et réglementation technique', niveau: 'expert' },
          { nom: 'Géotechnique et fondations', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1200000 },
          confirme: { min: 1200000, max: 2500000 },
          senior: { min: 2500000, max: 5000000 }
        },
        formation: [
          "Diplôme d'ingénieur en Génie Civil ou Master en Construction.",
          "Spécialisations : structures, géotechnique, hydraulique, transport.",
          "Certifications professionnelles (ex: PMP, certifications logiciels)."
        ],
        perspectives: [
          "Chef de projet ou Directeur technique.",
          "Directeur d'études ou Responsable bureau d'études.",
          "Expert consultant en construction.",
          "Créer son propre bureau d'études."
        ],
        environnementTravail: [
          "Bureaux d'études techniques et cabinets d'ingénierie.",
          "Entreprises de BTP et sociétés de construction.",
          "Administrations publiques (ministères, collectivités).",
          "Cabinets d'architecture et sociétés de maîtrise d'œuvre."
        ],
        tags: ['Construction', 'Ingénierie', 'BTP', 'Structures', 'Infrastructure']
      },
      {
        id: 'architecte',
        titre: 'Architecte',
        description: "L'Architecte conçoit et suit la réalisation de projets architecturaux. Il crée des espaces fonctionnels, esthétiques et durables en tenant compte des contraintes techniques, réglementaires et environnementales.",
        secteur: 'construction',
        missions: [
          "Concevoir des projets architecturaux (esquisses, plans, maquettes 3D).",
          "Élaborer les dossiers de permis de construire et d'autorisation.",
          "Assurer la maîtrise d'œuvre et le suivi de chantier.",
          "Coordonner les intervenants (bureaux d'études, entreprises).",
          "Respecter les normes d'accessibilité et de performance énergétique."
        ],
        competencesRequises: [
          { nom: 'Conception architecturale et design d\'espace', niveau: 'expert' },
          { nom: 'Logiciels 3D et BIM (Revit, ArchiCAD, SketchUp)', niveau: 'expert' },
          { nom: 'Gestion de projet et coordination d\'équipe', niveau: 'avancé' },
          { nom: 'Réglementation urbanisme et construction', niveau: 'expert' },
          { nom: 'Architecture durable et écoconstruction', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 4000000 }
        },
        formation: [
          "Diplôme d'État d'Architecte (DEA) ou Master en Architecture.",
          "Habilitation à la maîtrise d'œuvre en son nom propre (HMONP).",
          "Formations spécialisées : architecture durable, patrimoine, etc."
        ],
        perspectives: [
          "Architecte en chef ou Directeur de projet.",
          "Directeur de cabinet d'architecture.",
          "Urbaniste ou Paysagiste.",
          "Créer son propre cabinet d'architecture."
        ],
        environnementTravail: [
          "Cabinets d'architecture et agences d'urbanisme.",
          "Bureaux d'études et sociétés de maîtrise d'œuvre.",
          "Administrations publiques et collectivités.",
          "Indépendant (libéral)."
        ],
        tags: ['Architecture', 'Design', 'Construction', 'Urbanisme', 'BIM']
      },
      {
        id: 'conducteur-travaux',
        titre: 'Conducteur de Travaux',
        description: "Le Conducteur de Travaux supervise l'exécution des chantiers de construction. Il assure la coordination des équipes, le respect des délais et des budgets, ainsi que la qualité des réalisations.",
        secteur: 'construction',
        missions: [
          "Planifier et organiser l'exécution des travaux sur le chantier.",
          "Superviser les équipes d'ouvriers et de techniciens.",
          "Contrôler la qualité des travaux et le respect des normes.",
          "Gérer les approvisionnements et les relations avec les fournisseurs.",
          "Assurer la sécurité sur le chantier et le respect des règles HSE."
        ],
        competencesRequises: [
          { nom: 'Techniques de construction et procédés de mise en œuvre', niveau: 'expert' },
          { nom: 'Gestion d\'équipe et management opérationnel', niveau: 'expert' },
          { nom: 'Planification et suivi de chantier (MS Project, Primavera)', niveau: 'avancé' },
          { nom: 'Contrôle qualité et assurance construction', niveau: 'avancé' },
          { nom: 'Sécurité chantier et réglementation HSE', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 900000 },
          confirme: { min: 900000, max: 1800000 },
          senior: { min: 1800000, max: 3500000 }
        },
        formation: [
          "BTS ou DUT en BTP, Génie Civil ou Construction.",
          "Formation continue en conduite de travaux.",
          "Certifications sécurité chantier (SST, CACES)."
        ],
        perspectives: [
          "Chef de chantier ou Responsable travaux.",
          "Directeur technique ou Directeur d'exploitation.",
          "Chef d'entreprise BTP.",
          "Expert consultant en conduite de travaux."
        ],
        environnementTravail: [
          "Entreprises de BTP et sociétés de construction.",
          "Bureaux d'études et cabinets d'ingénierie.",
          "Promoteurs immobiliers et aménageurs.",
          "Administrations publiques (travaux publics)."
        ],
        tags: ['Conduite de travaux', 'Chantier', 'BTP', 'Management', 'Sécurité']
      }
    ]
  },
  {
    id: 'tourisme',
    nom: 'Tourisme & Hôtellerie',
    description: "Le secteur du tourisme et de l'hôtellerie au Sénégal est en pleine expansion grâce à la richesse culturelle, aux plages paradisiaques et aux sites historiques. Avec l'émergence de nouveaux hôtels, resorts et activités touristiques, les opportunités sont nombreuses pour les professionnels qualifiés dans l'accueil, la gestion hôtelière et l'organisation d'événements.",
    icone: '🏨',
    couleur: '#13c2c2',
    metiers: [
      {
        id: 'directeur-hotel',
        titre: 'Directeur d\'Hôtel / Hotel Manager',
        description: "Le Directeur d'Hôtel supervise l'ensemble des opérations d'un établissement hôtelier. Il assure la gestion commerciale, financière et opérationnelle tout en garantissant l'excellence du service client et la satisfaction des équipes.",
        secteur: 'tourisme',
        missions: [
          "Gérer l'ensemble des opérations hôtelières (réception, restauration, chambres, maintenance).",
          "Développer la stratégie commerciale et marketing de l'établissement.",
          "Superviser les équipes et assurer la formation du personnel.",
          "Gérer les relations avec les clients, fournisseurs et partenaires.",
          "Contrôler les indicateurs de performance (taux d'occupation, satisfaction client, rentabilité)."
        ],
        competencesRequises: [
          { nom: 'Gestion hôtelière et opérations', niveau: 'expert' },
          { nom: 'Management d\'équipe et leadership', niveau: 'expert' },
          { nom: 'Marketing hôtelier et stratégie commerciale', niveau: 'avancé' },
          { nom: 'Gestion financière et budgétaire', niveau: 'expert' },
          { nom: 'Service client et excellence opérationnelle', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 800000, max: 1500000 },
          confirme: { min: 1500000, max: 3000000 },
          senior: { min: 3000000, max: 6000000 }
        },
        formation: [
          "Master en Management Hôtelier ou MBA Hospitality.",
          "École hôtelière internationale (EHL, Glion, Les Roches).",
          "Formation continue en gestion hôtelière et leadership.",
          "Certifications en service client et management."
        ],
        perspectives: [
          "Directeur régional ou Directeur de groupe hôtelier.",
          "Consultant en développement hôtelier.",
          "Propriétaire d'établissement hôtelier.",
          "Directeur général d'entreprise touristique."
        ],
        environnementTravail: [
          "Hôtels, resorts et établissements de luxe.",
          "Groupes hôteliers internationaux et chaînes locales.",
          "Centres de villégiature et complexes touristiques.",
          "Bureaux de représentation hôtelière."
        ],
        tags: ['Hôtellerie', 'Management', 'Service client', 'Tourisme', 'Leadership']
      },
      {
        id: 'chef-restaurant',
        titre: 'Chef de Cuisine / Executive Chef',
        description: "Le Chef de Cuisine crée et supervise l'ensemble de l'offre gastronomique d'un établissement. Il gère l'équipe de cuisine, les approvisionnements et assure l'excellence culinaire tout en respectant les contraintes budgétaires et sanitaires.",
        secteur: 'tourisme',
        missions: [
          "Créer et développer les menus et cartes de l'établissement.",
          "Superviser l'équipe de cuisine et assurer la formation.",
          "Gérer les approvisionnements et les relations avec les fournisseurs.",
          "Contrôler la qualité des plats et le respect des normes d'hygiène.",
          "Optimiser les coûts et la rentabilité de la cuisine."
        ],
        competencesRequises: [
          { nom: 'Techniques culinaires et gastronomie', niveau: 'expert' },
          { nom: 'Gestion d\'équipe et formation', niveau: 'avancé' },
          { nom: 'Gestion des approvisionnements et coûts', niveau: 'avancé' },
          { nom: 'Hygiène alimentaire et sécurité sanitaire', niveau: 'expert' },
          { nom: 'Créativité culinaire et innovation', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2500000 },
          senior: { min: 2500000, max: 4500000 }
        },
        formation: [
          "CAP ou BEP en cuisine, puis formation continue.",
          "École hôtelière spécialisée en arts culinaires.",
          "Formations en gestion culinaire et management.",
          "Certifications en hygiène alimentaire (HACCP)."
        ],
        perspectives: [
          "Chef exécutif ou Directeur culinaire de groupe.",
          "Propriétaire de restaurant ou traiteur.",
          "Consultant culinaire ou formateur.",
          "Chef de cuisine dans des établissements de luxe."
        ],
        environnementTravail: [
          "Restaurants, hôtels et établissements gastronomiques.",
          "Catering et traiteurs événementiels.",
          "Centres de formation culinaire.",
          "Consulting en restauration."
        ],
        tags: ['Cuisine', 'Gastronomie', 'Management', 'Créativité', 'Hygiène']
      },
      {
        id: 'responsable-evenements',
        titre: 'Responsable Événementiel / Event Manager',
        description: "Le Responsable Événementiel conçoit, organise et supervise des événements professionnels et privés. Il coordonne tous les aspects logistiques, créatifs et opérationnels pour garantir le succès de chaque événement.",
        secteur: 'tourisme',
        missions: [
          "Concevoir et planifier des événements sur mesure (mariages, séminaires, lancements).",
          "Coordonner les prestataires (traiteurs, décorateurs, techniciens).",
          "Gérer le budget et les négociations avec les fournisseurs.",
          "Superviser la logistique et l'installation sur site.",
          "Assurer le suivi client et la satisfaction des participants."
        ],
        competencesRequises: [
          { nom: 'Organisation d\'événements et planification', niveau: 'expert' },
          { nom: 'Gestion de projet et coordination', niveau: 'avancé' },
          { nom: 'Négociation et relations fournisseurs', niveau: 'avancé' },
          { nom: 'Créativité et design événementiel', niveau: 'avancé' },
          { nom: 'Service client et communication', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 4000000 }
        },
        formation: [
          "Formation en événementiel ou management de projet.",
          "École de commerce spécialisée en événementiel.",
          "Certifications en gestion d'événements (CMP, CSEP).",
          "Formations continues en design et créativité."
        ],
        perspectives: [
          "Directeur d'agence événementielle.",
          "Consultant indépendant en événementiel.",
          "Responsable événementiel corporate.",
          "Créateur d'entreprise événementielle."
        ],
        environnementTravail: [
          "Agences événementielles et de communication.",
          "Hôtels et centres de congrès.",
          "Entreprises (événements internes).",
          "Indépendant (freelance événementiel)."
        ],
        tags: ['Événementiel', 'Organisation', 'Créativité', 'Logistique', 'Service client']
      }
    ]
  },
  {
    id: 'transport',
    nom: 'Transport & Logistique',
    description: "Le secteur du transport et de la logistique au Sénégal est stratégique pour l'économie nationale. Avec le port de Dakar, l'aéroport international et les projets d'infrastructure routière, les opportunités sont nombreuses pour les professionnels qualifiés dans la supply chain, le transport international et l'optimisation logistique.",
    icone: '🚛',
    couleur: '#1890ff',
    metiers: [
      {
        id: 'directeur-supply-chain',
        titre: 'Directeur Supply Chain / Supply Chain Manager',
        description: "Le Directeur Supply Chain optimise et supervise l'ensemble de la chaîne logistique de l'entreprise. Il assure la coordination entre l'approvisionnement, la production, la distribution et la satisfaction client tout en optimisant les coûts et les délais.",
        secteur: 'transport',
        missions: [
          "Définir et mettre en œuvre la stratégie supply chain de l'entreprise.",
          "Optimiser les flux logistiques (approvisionnement, stockage, distribution).",
          "Gérer les relations avec les fournisseurs et prestataires logistiques.",
          "Analyser et améliorer les indicateurs de performance logistique.",
          "Coordonner les équipes logistiques et assurer la formation."
        ],
        competencesRequises: [
          { nom: 'Gestion de la supply chain et logistique', niveau: 'expert' },
          { nom: 'Planification et optimisation des flux', niveau: 'expert' },
          { nom: 'Gestion des stocks et approvisionnements', niveau: 'expert' },
          { nom: 'Outils ERP et systèmes logistiques', niveau: 'avancé' },
          { nom: 'Management d\'équipe et leadership', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2500000 },
          senior: { min: 2500000, max: 5000000 }
        },
        formation: [
          "Master en Logistique et Supply Chain Management.",
          "École de commerce spécialisée en logistique.",
          "Formation continue en optimisation logistique.",
          "Certifications en supply chain (CSCP, CLTD)."
        ],
        perspectives: [
          "Directeur Logistique ou Directeur des Opérations.",
          "Consultant en optimisation supply chain.",
          "Directeur général d'entreprise logistique.",
          "Expert en transformation digitale logistique."
        ],
        environnementTravail: [
          "Entreprises industrielles et manufacturières.",
          "Sociétés de transport et logistique.",
          "Import-Export et commerce international.",
          "Cabinets de conseil en logistique."
        ],
        tags: ['Supply Chain', 'Logistique', 'Management', 'Optimisation', 'ERP']
      },
      {
        id: 'responsable-transport',
        titre: 'Responsable Transport / Transport Manager',
        description: "Le Responsable Transport supervise les opérations de transport de l'entreprise. Il optimise les routes, gère la flotte de véhicules, coordonne les chauffeurs et assure la conformité réglementaire tout en garantissant la qualité du service.",
        secteur: 'transport',
        missions: [
          "Planifier et optimiser les routes de transport et livraison.",
          "Gérer la flotte de véhicules et la maintenance préventive.",
          "Superviser les équipes de chauffeurs et techniciens.",
          "Assurer la conformité réglementaire et la sécurité routière.",
          "Négocier avec les prestataires et gérer les coûts de transport."
        ],
        competencesRequises: [
          { nom: 'Gestion de flotte et planification de transport', niveau: 'expert' },
          { nom: 'Optimisation de routes et géolocalisation', niveau: 'avancé' },
          { nom: 'Réglementation transport et sécurité routière', niveau: 'expert' },
          { nom: 'Gestion d\'équipe et coordination opérationnelle', niveau: 'avancé' },
          { nom: 'Outils de gestion de transport (TMS)', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 500000, max: 1000000 },
          confirme: { min: 1000000, max: 2000000 },
          senior: { min: 2000000, max: 4000000 }
        },
        formation: [
          "Formation en transport et logistique ou management.",
          "Certifications en gestion de flotte et sécurité routière.",
          "Formation continue en optimisation de transport.",
          "Certifications en systèmes de transport (TMS)."
        ],
        perspectives: [
          "Directeur des Opérations Transport.",
          "Consultant en optimisation de transport.",
          "Directeur logistique d'entreprise.",
          "Expert en mobilité et transport durable."
        ],
        environnementTravail: [
          "Sociétés de transport et messagerie.",
          "Entreprises avec flotte de véhicules.",
          "Prestataires logistiques et de distribution.",
          "Cabinets de conseil en transport."
        ],
        tags: ['Transport', 'Flotte', 'Routes', 'Sécurité', 'TMS']
      },
      {
        id: 'analyste-logistique',
        titre: 'Analyste Logistique / Logistics Analyst',
        description: "L'Analyste Logistique collecte, analyse et interprète les données logistiques pour optimiser les processus. Il utilise des outils d'analyse avancés pour identifier les améliorations possibles et proposer des solutions data-driven.",
        secteur: 'transport',
        missions: [
          "Collecter et analyser les données logistiques (KPI, métriques).",
          "Créer des tableaux de bord et rapports de performance.",
          "Identifier les opportunités d'optimisation logistique.",
          "Modéliser des scénarios et simulations logistiques.",
          "Présenter les recommandations aux équipes opérationnelles."
        ],
        competencesRequises: [
          { nom: 'Analyse de données et business intelligence', niveau: 'expert' },
          { nom: 'Outils d\'analyse (Excel, Power BI, Tableau)', niveau: 'avancé' },
          { nom: 'Processus logistiques et supply chain', niveau: 'avancé' },
          { nom: 'Statistiques et modélisation prédictive', niveau: 'intermédiaire' },
          { nom: 'Communication et présentation de résultats', niveau: 'avancé' }
        ],
        salaireMoyen: {
          junior: { min: 400000, max: 800000 },
          confirme: { min: 800000, max: 1600000 },
          senior: { min: 1600000, max: 3000000 }
        },
        formation: [
          "Master en Logistique, Supply Chain ou Data Science.",
          "Formation en business intelligence et analyse de données.",
          "Certifications en outils d'analyse (Power BI, Tableau).",
          "Formations continues en optimisation logistique."
        ],
        perspectives: [
          "Senior Analyst ou Lead Data Analyst.",
          "Consultant en optimisation logistique.",
          "Manager Supply Chain Analytics.",
          "Expert en transformation digitale logistique."
        ],
        environnementTravail: [
          "Entreprises avec supply chain complexe.",
          "Sociétés de transport et logistique.",
          "Cabinets de conseil en logistique.",
          "Startups logtech et entreprises tech."
        ],
        tags: ['Analyse', 'Data', 'KPI', 'Optimisation', 'Business Intelligence']
      }
    ]
  },
  {
    id: 'environnement',
    nom: 'Environnement & Énergie',
    description: "Le secteur de l'environnement et des énergies renouvelables au Sénégal est en pleine expansion grâce aux engagements climatiques et aux opportunités d'énergie verte. Avec l'émergence de projets solaires, éoliens et de développement durable, les professionnels qualifiés sont très recherchés pour accompagner la transition énergétique et écologique.",
    icone: '🌱',
    couleur: '#52c41a',
    metiers: [
      {
        id: 'ingenieur-energie-solaire',
        titre: 'Ingénieur en Énergie Solaire / Solar Energy Engineer',
        description: "L'Ingénieur en Énergie Solaire conçoit, développe et supervise des projets d'énergie solaire. Il assure la faisabilité technique, l'optimisation des performances et la maintenance des installations photovoltaïques pour contribuer à la transition énergétique.",
        secteur: 'environnement',
        missions: [
          "Concevoir et dimensionner des installations solaires photovoltaïques.",
          "Analyser la faisabilité technique et économique des projets solaires.",
          "Superviser la construction et l'installation des centrales solaires.",
          "Optimiser les performances et assurer la maintenance des installations.",
          "Assurer la conformité aux normes et réglementations en vigueur."
        ],
        competencesRequises: [
          { nom: 'Technologies solaires et photovoltaïques', niveau: 'expert' },
          { nom: 'Dimensionnement et conception d\'installations', niveau: 'expert' },
          { nom: 'Gestion de projet et coordination technique', niveau: 'avancé' },
          { nom: 'Outils de simulation (PVsyst, AutoCAD)', niveau: 'avancé' },
          { nom: 'Réglementation énergétique et normes techniques', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 600000, max: 1200000 },
          confirme: { min: 1200000, max: 2500000 },
          senior: { min: 2500000, max: 4500000 }
        },
        formation: [
          "Ingénieur en énergétique ou Master en énergies renouvelables.",
          "Spécialisation en énergie solaire et photovoltaïque.",
          "Certifications techniques en installation solaire.",
          "Formations continues en nouvelles technologies solaires."
        ],
        perspectives: [
          "Chef de projet solaire ou Directeur technique.",
          "Consultant en énergies renouvelables.",
          "Directeur d'exploitation de centrales solaires.",
          "Expert en développement de projets solaires."
        ],
        environnementTravail: [
          "Entreprises d'énergie et producteurs d'électricité.",
          "Bureaux d'études et cabinets d'ingénierie.",
          "Installateurs et mainteneurs d'équipements solaires.",
          "Organisations internationales et ONG environnementales."
        ],
        tags: ['Énergie solaire', 'Photovoltaïque', 'Renouvelable', 'Ingénierie', 'Développement durable']
      },
      {
        id: 'expert-environnement',
        titre: 'Expert Environnemental / Environmental Specialist',
        description: "L'Expert Environnemental évalue l'impact environnemental des projets et propose des solutions durables. Il assure la conformité réglementaire, la protection de l'environnement et l'accompagnement des entreprises dans leur transition écologique.",
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
        titre: 'Expert en Énergie Éolienne / Wind Energy Specialist',
        description: "L'Expert en Énergie Éolienne développe et gère des projets d'énergie éolienne. Il assure la conception, l'installation et l'exploitation des parcs éoliens pour contribuer au mix énergétique renouvelable du Sénégal.",
        secteur: 'environnement',
        competencesRequises: [
          { nom: 'Technologie éolienne', niveau: 'expert' },
          { nom: 'Gestion projet', niveau: 'avancé' },
          { nom: 'Études impact', niveau: 'avancé' },
          { nom: 'Maintenance éolienne', niveau: 'expert' }
        ],
        salaireMoyen: {
          junior: { min: 700000, max: 1400000 },
          confirme: { min: 1400000, max: 2800000 },
          senior: { min: 2800000, max: 5000000 }
        },
        formation: [
          "Ingénieur en énergies ou Master spécialisé en éolien.",
          "Formation en technologies éoliennes et maintenance.",
          "Certifications techniques en énergie éolienne.",
          "Formations continues en nouvelles technologies éoliennes."
        ],
        perspectives: [
          "Chef de projet éolien ou Directeur technique.",
          "Consultant en énergies renouvelables.",
          "Directeur d'exploitation de parcs éoliens.",
          "Expert en développement de projets éoliens."
        ],
        environnementTravail: [
          "Parcs éoliens et producteurs d'énergie éolienne.",
          "Bureaux d'études et cabinets d'ingénierie.",
          "Fabricants et installateurs d'éoliennes.",
          "Organisations internationales et institutions financières."
        ],
        tags: ['Énergie éolienne', 'Parcs éoliens', 'Renouvelable', 'Maintenance', 'Développement durable']
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
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetier, setSelectedMetier] = useState<FicheMetier | null>(null);
  const [forceShow, setForceShow] = useState(false);
  const isPremium = hasPremiumAccess(user, hasActiveSubscription);
  const [loadingMetier, setLoadingMetier] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Scroll automatique vers le contenu quand on change d'onglet (pas au chargement initial)
  useEffect(() => {
    if (!loadingPage && !isInitialLoad) {
      const timer = setTimeout(() => {
        const contentElement = document.querySelector('.ant-tabs-content-holder');
        if (contentElement) {
          contentElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab, loadingPage, isInitialLoad]);

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
    setLoadingMetier(true);
    setSelectedMetier(null);
    setTimeout(() => {
      setSelectedMetier(metier);
      setLoadingMetier(false);
    }, 350);
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

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setIsInitialLoad(false);
  };

  if (loadingPage) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="Chargement des métiers..." />
      </div>
    );
  }

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
        <Tabs defaultActiveKey="all" centered onChange={handleTabChange}>
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
              <div style={{ marginBottom: 48 }}>
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
            </TabPane>
          ))}
        </Tabs>
        <Modal
          visible={!!selectedMetier}
          onCancel={() => setSelectedMetier(null)}
          footer={null}
          width={800}
          destroyOnClose
        >
          {loadingMetier ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
              <Spin size="large" tip="Chargement de la fiche métier..." />
            </div>
          ) : (
            selectedMetier && (
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
            )
          )}
        </Modal>
      </Space>
    </div>
  );
};

export default CareersPage; 