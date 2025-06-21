// Fichier central de configuration des templates de CV sectoriels
import FinanceTemplate from '../templates/FinanceTemplate';
import MarketingTemplate from '../templates/MarketingTemplate';
import HealthTemplate from '../templates/HealthTemplate';
import EducationTemplate from '../templates/EducationTemplate';
import CommerceTemplate from '../templates/CommerceTemplate';
import AdminTemplate from '../templates/AdminTemplate';
import TechTemplate from '../templates/TechTemplate';
import LogisticsTemplate from '../templates/LogisticsTemplate';
import BtpTemplate from '../templates/BtpTemplate';
import ArtTemplate from '../templates/ArtTemplate';
import HotelTemplate from '../templates/HotelTemplate';
import LawTemplate from '../templates/LawTemplate';
import ComTemplate from '../templates/ComTemplate';
import AgroTemplate from '../templates/AgroTemplate';
import HumanTemplate from '../templates/HumanTemplate';
import BankTemplate from '../templates/BankTemplate';
import TechModernTemplate from '../templates/TechModernTemplate';
import WindowTemplate from '../templates/WindowTemplate';
import { DEMO_PROFILES } from '../../CVPreviewGallery';
import financePreview from '../../../../assets/cv-templates/finance-preview.png';
import marketingPreview from '../../../../assets/cv-templates/marketing-preview.png';
import healthPreview from '../../../../assets/cv-templates/health-preview.png';
import educationPreview from '../../../../assets/cv-templates/education-preview.png';
import commercePreview from '../../../../assets/cv-templates/commerce-preview.png';
import adminPreview from '../../../../assets/cv-templates/admin-preview.png';
import techPreview from '../../../../assets/cv-templates/tech-preview.png';
import logisticsPreview from '../../../../assets/cv-templates/logistics-preview.png';
import btpPreview from '../../../../assets/cv-templates/btp-preview.png';
import artPreview from '../../../../assets/cv-templates/art-preview.png';
import hotelPreview from '../../../../assets/cv-templates/hotel-preview.png';
import lawPreview from '../../../../assets/cv-templates/law-preview.png';
import comPreview from '../../../../assets/cv-templates/com-preview.png';
import agroPreview from '../../../../assets/cv-templates/agro-preview.png';
import humanPreview from '../../../../assets/cv-templates/human-preview.png';
import bankPreview from '../../../../assets/cv-templates/bank-preview.png';
import techModernPreview from '../../../../assets/cv-templates/tech-modern-preview.png';

export interface CVTemplateConfig {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  description: string;
  premium: boolean;
  category: string;
  thumbnail: string;
  previewImage?: string;
  features?: string[];
  profileImage?: string;
  sampleData?: any;
}

export const CV_TEMPLATES: CVTemplateConfig[] = [
  {
    id: 'finance',
    name: 'Finance',
    component: FinanceTemplate,
    description: 'CV moderne pour métiers de la finance, banque, assurance',
    premium: true,
    category: 'Finance',
    thumbnail: financePreview,
    previewImage: financePreview,
    features: ['Design moderne', 'Couleurs professionnelles', 'Sections personnalisables'],
    profileImage: '/images/avatars/man-1.png',
    sampleData: DEMO_PROFILES.finance,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    component: MarketingTemplate,
    description: 'CV dynamique pour marketing, communication, digital',
    premium: true,
    category: 'Marketing',
    thumbnail: marketingPreview,
    previewImage: marketingPreview,
    features: ['Couleurs vives', 'Mise en avant des compétences', 'Design attractif'],
    profileImage: '/images/avatars/woman-1.png',
    sampleData: DEMO_PROFILES.marketing,
  },
  {
    id: 'health',
    name: 'Santé',
    component: HealthTemplate,
    description: 'CV apaisant pour métiers de la santé',
    premium: true,
    category: 'Santé',
    thumbnail: healthPreview,
    previewImage: healthPreview,
    features: ['Palette bleu/vert', 'Sections certifications', 'Design épuré'],
    profileImage: '/images/avatars/woman-2.png',
    sampleData: DEMO_PROFILES.health,
  },
  {
    id: 'education',
    name: 'Éducation',
    component: EducationTemplate,
    description: 'CV pour enseignants, pédagogie, formation',
    premium: true,
    category: 'Éducation',
    thumbnail: educationPreview,
    previewImage: educationPreview,
    features: ['Sections pédagogie', 'Expérience détaillée', 'Design doux'],
    profileImage: '/images/avatars/man-2.png',
    sampleData: DEMO_PROFILES.education,
  },
  {
    id: 'commerce',
    name: 'Commerce',
    component: CommerceTemplate,
    description: 'CV pour vente, négociation, gestion commerciale',
    premium: true,
    category: 'Commerce',
    thumbnail: commercePreview,
    previewImage: commercePreview,
    features: ['Accent sur les résultats', 'Design dynamique', 'Sections réalisations'],
    profileImage: '/images/avatars/man-3.png',
    sampleData: DEMO_PROFILES.commerce,
  },
  {
    id: 'admin',
    name: 'Administration / RH',
    component: AdminTemplate,
    description: 'CV moderne et professionnel pour les métiers RH et administratifs',
    premium: true,
    category: 'Administration',
    thumbnail: adminPreview,
    previewImage: adminPreview,
    features: [
      'Design épuré et moderne',
      'Mise en page professionnelle',
      'Sections bien structurées',
      'Parfait pour les profils RH',
      'Lisibilité optimale'
    ],
    profileImage: '/images/avatars/woman-3.png',
    sampleData: {
      ...DEMO_PROFILES.admin,
      personalInfo: {
        ...DEMO_PROFILES.admin.personalInfo,
        title: 'Responsable Ressources Humaines',
      }
    }
  },
  {
    id: 'tech',
    name: 'Tech / Informatique',
    component: TechTemplate,
    description: 'CV moderne et graphique pour développeur, ingénieur, IT',
    premium: true,
    category: 'Tech',
    thumbnail: techPreview,
    previewImage: techPreview,
    features: [
      'Design hexagonal et graphique',
      'Sections dynamiques',
      'Expertise avec icônes',
      'Expériences et achievements en chevrons',
      'Lisibilité optimale'
    ],
    profileImage: '/images/avatars/man-4.png',
    sampleData: {
      ...DEMO_PROFILES.tech,
      achievements: [
        { title: 'Studio Showcase', description: "Intégration et design d\"une plateforme de gestion de projets web, primée pour son UX." }
      ]
    }
  },
  {
    id: 'logistics',
    name: 'Logistique / Transport',
    component: LogisticsTemplate,
    description: 'CV moderne et épuré pour les métiers de la logistique, supply chain et transport',
    premium: true,
    category: 'Logistique',
    thumbnail: logisticsPreview,
    previewImage: logisticsPreview,
    features: [
      'Design bleu/blanc moderne',
      'Barres latérales pour les titres',
      'Expérience professionnelle en cartes',
      'Références dynamiques',
      'Lisibilité optimale'
    ],
    profileImage: '/images/avatars/man-5.png',
    sampleData: {
      ...DEMO_PROFILES.logistics,
      references: [
        { name: 'Bailey Dupont', position: 'Directeur Logistique, Wardeo Inc.', contact: 'bailey.dupont@wardeo.com / +33 6 12 34 56 78' },
        { name: 'Harumi Kobayashi', position: 'CEO, Wardeo Inc.', contact: 'harumi.kobayashi@wardeo.com / +81 90 1234 5678' }
      ]
    }
  },
  {
    id: 'btp',
    name: 'BTP / Ingénierie',
    component: BtpTemplate,
    description: 'CV pour chantier, architecture, génie civil',
    premium: true,
    category: 'BTP',
    thumbnail: btpPreview,
    previewImage: btpPreview,
    features: ['Expérience chantiers', 'Design robuste', 'Sections certifications'],
    profileImage: '/images/avatars/man-1.png',
    sampleData: DEMO_PROFILES.btp,
  },
  {
    id: 'art',
    name: 'Art / Création / Design',
    component: ArtTemplate,
    description: 'CV créatif pour design, graphisme, illustration',
    premium: true,
    category: 'Art',
    thumbnail: artPreview,
    previewImage: artPreview,
    features: ['Palette créative', 'Portfolio intégré', 'Design original'],
    profileImage: '/images/avatars/woman-4.png',
    sampleData: DEMO_PROFILES.art,
  },
  {
    id: 'hotel',
    name: 'Hôtellerie / Tourisme',
    component: HotelTemplate,
    description: 'CV pour accueil, animation, restauration',
    premium: true,
    category: 'Hôtellerie',
    thumbnail: hotelPreview,
    previewImage: hotelPreview,
    features: ['Expérience accueil', 'Design chaleureux', 'Sections langues'],
    profileImage: '/images/avatars/woman-5.png',
    sampleData: DEMO_PROFILES.hotel,
  },
  {
    id: 'law',
    name: 'Juridique / Droit',
    component: LawTemplate,
    description: 'CV pour avocat, juriste, assistant juridique',
    premium: true,
    category: 'Juridique',
    thumbnail: lawPreview,
    previewImage: lawPreview,
    features: ['Sections juridiques', 'Design sérieux', 'Mise en avant des diplômes'],
    profileImage: '/images/avatars/man-1.png',
    sampleData: DEMO_PROFILES.law,
  },
  {
    id: 'com',
    name: 'Communication / Médias',
    component: ComTemplate,
    description: 'CV pour journaliste, communicant, community manager',
    premium: true,
    category: 'Communication',
    thumbnail: comPreview,
    previewImage: comPreview,
    features: ['Design moderne', 'Mise en avant des projets', 'Sections portfolio'],
    profileImage: '/images/avatars/woman-1.png',
    sampleData: DEMO_PROFILES.com,
  },
  {
    id: 'agro',
    name: 'Agroalimentaire',
    component: AgroTemplate,
    description: 'CV pour ingénieur agronome, technicien agricole',
    premium: true,
    category: 'Agroalimentaire',
    thumbnail: agroPreview,
    previewImage: agroPreview,
    features: ['Expérience agricole', 'Design naturel', 'Sections certifications bio'],
    profileImage: '/images/avatars/man-2.png',
    sampleData: DEMO_PROFILES.agro,
  },
  {
    id: 'human',
    name: 'Ressources Humaines',
    component: HumanTemplate,
    description: 'CV pour recruteur, gestionnaire RH, consultant',
    premium: true,
    category: 'Ressources Humaines',
    thumbnail: humanPreview,
    previewImage: humanPreview,
    features: ['Mise en avant des compétences', 'Design sobre', 'Sections références'],
    profileImage: '/images/avatars/woman-3.png',
    sampleData: DEMO_PROFILES.human,
  },
  {
    id: 'bank',
    name: 'Banque / Assurance',
    component: BankTemplate,
    description: 'CV pour conseiller clientèle, analyste financier',
    premium: true,
    category: 'Banque',
    thumbnail: bankPreview,
    previewImage: bankPreview,
    features: ['Expérience bancaire', 'Design confiance', 'Sections chiffres clés'],
    profileImage: '/images/avatars/man-3.png',
    sampleData: DEMO_PROFILES.bank,
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    component: TechModernTemplate,
    description: 'CV tech moderne, design épuré, pour profils IT',
    premium: true,
    category: 'Tech',
    thumbnail: techModernPreview,
    previewImage: techModernPreview,
    features: ['Design épuré', 'Sections projets', 'Palette tech'],
    profileImage: '/images/avatars/man-4.png',
    sampleData: DEMO_PROFILES.tech,
  },
  {
    id: 'window',
    name: 'Window',
    component: WindowTemplate,
    description: 'CV moderne avec effet de fenêtre',
    premium: true,
    category: 'Créatif',
    thumbnail: techModernPreview, // Placeholder
    previewImage: techModernPreview, // Placeholder
    features: ['Effet de fenêtre', 'Design moderne', 'Mise en avant des compétences'],
    profileImage: '/images/avatars/woman-5.png',
    sampleData: DEMO_PROFILES.art,
  },
]; 