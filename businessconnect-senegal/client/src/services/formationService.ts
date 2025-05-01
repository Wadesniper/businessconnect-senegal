import { authService } from './authService';
import { DomainType } from '../types/formation';

const CURSA_BASE_URL = 'https://cursa.app';

// Liens des domaines de formation
const DOMAIN_URLS = {
  informatique: `${CURSA_BASE_URL}/formations/informatique`,
  marketing: `${CURSA_BASE_URL}/formations/marketing-digital`,
  gestion: `${CURSA_BASE_URL}/formations/gestion-entreprise`,
  langues: `${CURSA_BASE_URL}/formations/langues`,
  softSkills: `${CURSA_BASE_URL}/formations/soft-skills`,
  design: `${CURSA_BASE_URL}/formations/design-multimedia`,
  finance: `${CURSA_BASE_URL}/formations/finance-comptabilite`,
  entrepreneuriat: `${CURSA_BASE_URL}/formations/entrepreneuriat`
};

export const formationService = {
  redirectToCursa(domain?: DomainType) {
    const url = domain 
      ? `${CURSA_BASE_URL}/formations/${domain}`
      : CURSA_BASE_URL;
    
    window.open(url, '_blank');
  },

  handleCursaReturn: () => {
    // Redirection vers le tableau de bord
    window.location.href = '/dashboard';
  },

  getDomainUrls: () => DOMAIN_URLS
};

export default formationService; 