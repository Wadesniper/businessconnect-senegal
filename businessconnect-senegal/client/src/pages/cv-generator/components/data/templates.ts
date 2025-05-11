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
    thumbnail: '/images/cv-templates/finance.png',
    previewImage: '/images/cv-templates/finance-preview.png',
    features: ['Design moderne', 'Couleurs professionnelles', 'Sections personnalisables'],
    profileImage: '/images/avatars/man-1.png',
    sampleData: {},
  },
  {
    id: 'marketing',
    name: 'Marketing',
    component: MarketingTemplate,
    description: 'CV dynamique pour marketing, communication, digital',
    premium: true,
    category: 'Marketing',
    thumbnail: '/images/cv-templates/marketing.png',
    previewImage: '/images/cv-templates/marketing-preview.png',
    features: ['Couleurs vives', 'Mise en avant des compétences', 'Design attractif'],
    profileImage: '/images/avatars/woman-1.png',
    sampleData: {},
  },
  {
    id: 'health',
    name: 'Santé',
    component: HealthTemplate,
    description: 'CV apaisant pour métiers de la santé',
    premium: true,
    category: 'Santé',
    thumbnail: '/images/cv-templates/health.png',
    previewImage: '/images/cv-templates/health-preview.png',
    features: ['Palette bleu/vert', 'Sections certifications', 'Design épuré'],
    profileImage: '/images/avatars/woman-2.png',
    sampleData: {},
  },
  {
    id: 'education',
    name: 'Éducation',
    component: EducationTemplate,
    description: 'CV pour enseignants, pédagogie, formation',
    premium: false,
    category: 'Éducation',
    thumbnail: '/images/cv-templates/education.png',
    previewImage: '/images/cv-templates/education-preview.png',
    features: ['Sections pédagogie', 'Expérience détaillée', 'Design doux'],
    profileImage: '/images/avatars/man-2.png',
    sampleData: {},
  },
  {
    id: 'commerce',
    name: 'Commerce',
    component: CommerceTemplate,
    description: 'CV pour vente, négociation, gestion commerciale',
    premium: false,
    category: 'Commerce',
    thumbnail: '/images/cv-templates/commerce.png',
    previewImage: '/images/cv-templates/commerce-preview.png',
    features: ['Accent sur les résultats', 'Design dynamique', 'Sections réalisations'],
    profileImage: '/images/avatars/man-3.png',
    sampleData: {},
  },
  {
    id: 'admin',
    name: 'Administration / RH',
    component: AdminTemplate,
    description: 'CV pour gestion, RH, administration',
    premium: false,
    category: 'Administration',
    thumbnail: '/images/cv-templates/admin.png',
    previewImage: '/images/cv-templates/admin-preview.png',
    features: ['Sections gestion', 'Design sobre', 'Mise en avant des compétences RH'],
    profileImage: '/images/avatars/woman-3.png',
    sampleData: {},
  },
  {
    id: 'tech',
    name: 'Tech / Informatique',
    component: TechTemplate,
    description: 'CV moderne pour développeur, ingénieur, data',
    premium: true,
    category: 'Tech',
    thumbnail: '/images/cv-templates/tech.png',
    previewImage: '/images/cv-templates/tech-preview.png',
    features: ['Sections projets', 'Compétences techniques', 'Design moderne'],
    profileImage: '/images/avatars/man-4.png',
    sampleData: {},
  },
  {
    id: 'logistics',
    name: 'Logistique / Transport',
    component: LogisticsTemplate,
    description: 'CV pour supply chain, gestion de flotte',
    premium: false,
    category: 'Logistique',
    thumbnail: '/images/cv-templates/logistics.png',
    previewImage: '/images/cv-templates/logistics-preview.png',
    features: ['Sections logistique', 'Design structuré', 'Mise en avant des certifications'],
    profileImage: '/images/avatars/man-5.png',
    sampleData: {},
  },
  {
    id: 'btp',
    name: 'BTP / Ingénierie',
    component: BtpTemplate,
    description: 'CV pour chantier, architecture, génie civil',
    premium: false,
    category: 'BTP',
    thumbnail: '/images/cv-templates/btp.png',
    previewImage: '/images/cv-templates/btp-preview.png',
    features: ['Expérience chantiers', 'Design robuste', 'Sections certifications'],
    profileImage: '/images/avatars/man-1.png',
    sampleData: {},
  },
  {
    id: 'art',
    name: 'Art / Création / Design',
    component: ArtTemplate,
    description: 'CV créatif pour design, graphisme, illustration',
    premium: true,
    category: 'Art',
    thumbnail: '/images/cv-templates/art.png',
    previewImage: '/images/cv-templates/art-preview.png',
    features: ['Palette créative', 'Portfolio intégré', 'Design original'],
    profileImage: '/images/avatars/woman-4.png',
    sampleData: {},
  },
  {
    id: 'hotel',
    name: 'Hôtellerie / Tourisme',
    component: HotelTemplate,
    description: 'CV pour accueil, animation, restauration',
    premium: false,
    category: 'Hôtellerie',
    thumbnail: '/images/cv-templates/hotel.png',
    previewImage: '/images/cv-templates/hotel-preview.png',
    features: ['Expérience accueil', 'Design chaleureux', 'Sections langues'],
    profileImage: '/images/avatars/woman-5.png',
    sampleData: {},
  },
  {
    id: 'law',
    name: 'Juridique / Droit',
    component: LawTemplate,
    description: 'CV pour avocat, juriste, assistant juridique',
    premium: false,
    category: 'Juridique',
    thumbnail: '/images/cv-templates/law.png',
    previewImage: '/images/cv-templates/law-preview.png',
    features: ['Sections juridiques', 'Design sérieux', 'Mise en avant des diplômes'],
    profileImage: '/images/avatars/man-1.png',
    sampleData: {},
  },
  {
    id: 'com',
    name: 'Communication / Médias',
    component: ComTemplate,
    description: 'CV pour journaliste, communicant, community manager',
    premium: true,
    category: 'Communication',
    thumbnail: '/images/cv-templates/com.png',
    previewImage: '/images/cv-templates/com-preview.png',
    features: ['Sections médias', 'Design dynamique', 'Portfolio'],
    profileImage: '/images/avatars/woman-1.png',
    sampleData: {},
  },
  {
    id: 'agro',
    name: 'Agroalimentaire / Agriculture',
    component: AgroTemplate,
    description: 'CV pour technicien agricole, ingénieur agro',
    premium: false,
    category: 'Agroalimentaire',
    thumbnail: '/images/cv-templates/agro.png',
    previewImage: '/images/cv-templates/agro-preview.png',
    features: ['Expérience terrain', 'Design nature', 'Sections certifications'],
    profileImage: '/images/avatars/man-2.png',
    sampleData: {},
  },
  {
    id: 'human',
    name: 'Humanitaire / Social',
    component: HumanTemplate,
    description: 'CV pour ONG, éducateur, travailleur social',
    premium: false,
    category: 'Humanitaire',
    thumbnail: '/images/cv-templates/human.png',
    previewImage: '/images/cv-templates/human-preview.png',
    features: ['Sections engagement', 'Design doux', 'Mise en avant des langues'],
    profileImage: '/images/avatars/woman-2.png',
    sampleData: {},
  },
  {
    id: 'bank',
    name: 'Banque / Assurance',
    component: BankTemplate,
    description: 'CV pour conseiller bancaire, gestionnaire assurance',
    premium: true,
    category: 'Banque',
    thumbnail: '/images/cv-templates/bank.png',
    previewImage: '/images/cv-templates/bank-preview.png',
    features: ['Sections finance', 'Design premium', 'Mise en avant des certifications'],
    profileImage: '/images/avatars/man-3.png',
    sampleData: {},
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    component: TechModernTemplate,
    description: 'CV tech moderne, design épuré, pour profils IT',
    premium: true,
    category: 'Tech',
    thumbnail: '/images/cv-templates/tech-modern.png',
    previewImage: '/images/cv-templates/tech-modern-preview.png',
    features: ['Design épuré', 'Sections projets', 'Palette tech'],
    profileImage: '/images/avatars/man-4.png',
    sampleData: {},
  },
]; 