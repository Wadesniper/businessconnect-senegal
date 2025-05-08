import { DomainType } from '../types/formation.types';
import { api } from './api';
import { Formation, FormationFilters, InscriptionFormation, Categorie } from '../pages/formations/types';

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
} as const;

class FormationService {
  static redirectToCursa(domain: DomainType): void {
    const url = DOMAIN_URLS[domain] || CURSA_BASE_URL;
    window.open(url, '_blank');
  }

  static getDomainUrls(): typeof DOMAIN_URLS {
    return DOMAIN_URLS;
  }

  // Récupérer les formations avec filtres et pagination
  async getFormations(filters?: FormationFilters): Promise<{
    formations: Formation[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (filters?.categorie) queryParams.append('categorie', filters.categorie);
    if (filters?.niveau) queryParams.append('niveau', filters.niveau);
    if (filters?.prix?.min) queryParams.append('prixMin', filters.prix.min.toString());
    if (filters?.prix?.max) queryParams.append('prixMax', filters.prix.max.toString());
    if (filters?.duree?.min) queryParams.append('dureeMin', filters.duree.min.toString());
    if (filters?.duree?.max) queryParams.append('dureeMax', filters.duree.max.toString());
    if (filters?.modalite) queryParams.append('modalite', filters.modalite);
    if (filters?.certifiant !== undefined) queryParams.append('certifiant', filters.certifiant.toString());
    if (filters?.searchTerm) queryParams.append('search', filters.searchTerm);
    if (filters?.tri) queryParams.append('tri', filters.tri);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const response = await api.get(`/formations?${queryParams.toString()}`);
    return response.data;
  }

  // Récupérer une formation par son ID
  async getFormationById(id: string): Promise<Formation> {
    const response = await api.get(`/formations/${id}`);
    return response.data;
  }

  // Récupérer les catégories de formation
  async getCategories(): Promise<Categorie[]> {
    const response = await api.get('/formations/categories');
    return response.data;
  }

  // S'inscrire à une formation
  async inscrireFormation(formationId: string): Promise<InscriptionFormation> {
    const response = await api.post(`/formations/${formationId}/inscription`);
    return response.data;
  }

  // Annuler une inscription
  async annulerInscription(formationId: string): Promise<void> {
    await api.delete(`/formations/${formationId}/inscription`);
  }

  // Mettre à jour la progression
  async updateProgression(formationId: string, progression: number): Promise<InscriptionFormation> {
    const response = await api.patch(`/formations/${formationId}/progression`, { progression });
    return response.data;
  }

  // Obtenir les formations d'un utilisateur
  async getMesFormations(): Promise<InscriptionFormation[]> {
    const response = await api.get('/formations/mes-formations');
    return response.data;
  }

  // Ajouter un avis sur une formation
  async ajouterAvis(formationId: string, note: number, commentaire: string): Promise<void> {
    await api.post(`/formations/${formationId}/avis`, { note, commentaire });
  }

  // Obtenir les avis d'une formation
  async getAvis(formationId: string, page = 1, limit = 10): Promise<{
    avis: Formation['avis'];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await api.get(`/formations/${formationId}/avis?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Obtenir les prochaines sessions d'une formation
  async getProchaineSessions(formationId: string): Promise<Formation['prochaineSessions']> {
    const response = await api.get(`/formations/${formationId}/sessions`);
    return response.data;
  }

  // S'inscrire à une session spécifique
  async inscrireSession(formationId: string, sessionId: string): Promise<InscriptionFormation> {
    const response = await api.post(`/formations/${formationId}/sessions/${sessionId}/inscription`);
    return response.data;
  }

  // Télécharger le certificat
  async telechargerCertificat(formationId: string): Promise<Blob> {
    const response = await api.get(`/formations/${formationId}/certificat`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Vérifier la validité d'un certificat
  async verifierCertificat(certificatId: string): Promise<{
    valide: boolean;
    formation: Formation;
    dateObtention: string;
  }> {
    const response = await api.get(`/formations/certificats/${certificatId}/verification`);
    return response.data;
  }
}

export default FormationService; 