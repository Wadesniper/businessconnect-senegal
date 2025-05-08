import { CVData } from '../types';

interface ShareOptions {
  method: 'email' | 'link' | 'social';
  recipient?: string;
  message?: string;
  expirationDays?: number;
}

export class ShareService {
  private static readonly API_URL = '/api/cv/share';

  static async generateShareLink(cvId: string): Promise<string> {
    try {
      const response = await fetch(`${this.API_URL}/link/${cvId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du lien de partage');
      }

      const data = await response.json();
      return data.shareLink;
    } catch (error) {
      console.error('Erreur de partage:', error);
      throw error;
    }
  }

  static async shareByEmail(cvId: string, email: string, message?: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvId,
          recipientEmail: email,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du CV par email');
      }
    } catch (error) {
      console.error('Erreur de partage par email:', error);
      throw error;
    }
  }

  static async shareOnSocialMedia(cvId: string, platform: 'linkedin' | 'twitter'): Promise<string> {
    try {
      const response = await fetch(`${this.API_URL}/social/${platform}/${cvId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors du partage sur ${platform}`);
      }

      const data = await response.json();
      return data.shareUrl;
    } catch (error) {
      console.error('Erreur de partage sur les réseaux sociaux:', error);
      throw error;
    }
  }
} 