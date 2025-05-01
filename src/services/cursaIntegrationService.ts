import axios from 'axios';
import { Formation } from '../models/formation';
import { User } from '../models/User';
import { AppError } from '../utils/appError';

class CursaIntegrationService {
  private readonly cursaApiUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.cursaApiUrl = process.env.CURSA_API_URL || 'https://api.cursa.app';
    this.apiKey = process.env.CURSA_API_KEY || '';
  }

  async syncCursaFormations(): Promise<void> {
    try {
      const response = await axios.get(`${this.cursaApiUrl}/courses`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      const cursaFormations = response.data;

      for (const cursaFormation of cursaFormations) {
        await Formation.findOneAndUpdate(
          { cursaUrl: cursaFormation.url },
          {
            title: cursaFormation.title,
            description: cursaFormation.description,
            category: this.mapCursaCategory(cursaFormation.category),
            level: this.mapCursaLevel(cursaFormation.level),
            duration: cursaFormation.duration,
            price: cursaFormation.price,
            thumbnail: cursaFormation.thumbnail,
            isExternalCourse: true,
            cursaUrl: cursaFormation.url
          },
          { upsert: true, new: true }
        );
      }
    } catch (error) {
      throw new AppError('Erreur lors de la synchronisation avec Cursa.app', 500);
    }
  }

  async validateUserAccess(userId: string, formationId: string): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      const formation = await Formation.findById(formationId);

      if (!user || !formation) {
        throw new AppError('Utilisateur ou formation non trouvé', 404);
      }

      // Vérifier si l'utilisateur a un abonnement actif
      const hasActiveSubscription = await this.checkUserSubscription(userId);
      if (!hasActiveSubscription) {
        return false;
      }

      return true;
    } catch (error) {
      throw new AppError('Erreur lors de la vérification de l\'accès', 500);
    }
  }

  async getFormationRedirectUrl(formationId: string): Promise<string> {
    try {
      const formation = await Formation.findById(formationId);
      if (!formation) {
        throw new AppError('Formation non trouvée', 404);
      }

      return formation.cursaUrl;
    } catch (error) {
      throw new AppError('Erreur lors de la récupération de l\'URL de redirection', 500);
    }
  }

  private async checkUserSubscription(userId: string): Promise<boolean> {
    // TODO: Implémenter la vérification de l'abonnement
    // Cette méthode devrait vérifier dans la base de données si l'utilisateur a un abonnement actif
    return true;
  }

  private mapCursaCategory(cursaCategory: string): string {
    const categoryMap: { [key: string]: string } = {
      'development': 'développement',
      'business': 'business',
      'marketing': 'marketing',
      'design': 'design',
      'languages': 'langues',
      'soft-skills': 'soft-skills'
    };
    return categoryMap[cursaCategory] || 'autres';
  }

  private mapCursaLevel(cursaLevel: string): string {
    const levelMap: { [key: string]: string } = {
      'beginner': 'débutant',
      'intermediate': 'intermédiaire',
      'advanced': 'avancé'
    };
    return levelMap[cursaLevel] || 'débutant';
  }
}

export const cursaIntegrationService = new CursaIntegrationService(); 