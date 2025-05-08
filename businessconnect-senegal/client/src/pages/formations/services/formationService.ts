import { Formation } from '../types';

interface FormationFilters {
  searchTerm?: string;
  categorie?: string;
  niveau?: string;
  page?: number;
  pageSize?: number;
}

export default class FormationService {
  private static readonly API_URL = '/api/formations';

  static async getFormations(filters: FormationFilters = {}): Promise<{ 
    formations: Formation[]; 
    total: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.searchTerm) {
        queryParams.append('search', filters.searchTerm);
      }
      if (filters.categorie) {
        queryParams.append('categorie', filters.categorie);
      }
      if (filters.niveau) {
        queryParams.append('niveau', filters.niveau);
      }
      if (filters.page) {
        queryParams.append('page', filters.page.toString());
      }
      if (filters.pageSize) {
        queryParams.append('pageSize', filters.pageSize.toString());
      }

      const response = await fetch(
        `${this.API_URL}?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des formations');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur FormationService:', error);
      throw error;
    }
  }

  static async getFormationById(id: string): Promise<Formation> {
    try {
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Formation non trouvée');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur FormationService:', error);
      throw error;
    }
  }

  static async inscrireFormation(formationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/${formationId}/inscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'inscription à la formation');
      }
    } catch (error) {
      console.error('Erreur FormationService:', error);
      throw error;
    }
  }

  static async noterFormation(formationId: string, note: number): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/${formationId}/note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la notation de la formation');
      }
    } catch (error) {
      console.error('Erreur FormationService:', error);
      throw error;
    }
  }
} 