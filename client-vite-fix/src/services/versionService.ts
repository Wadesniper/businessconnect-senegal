// Service de gestion des versions pour détecter les mises à jour
class VersionService {
  private static instance: VersionService;
  private currentVersion: string;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Version actuelle de l'application (à incrémenter à chaque déploiement)
    this.currentVersion = '1.0.0';
    this.init();
  }

  static getInstance(): VersionService {
    if (!VersionService.instance) {
      VersionService.instance = new VersionService();
    }
    return VersionService.instance;
  }

  private init() {
    // Vérifier la version au chargement
    this.checkVersion();
    
    // Vérifier périodiquement (toutes les 5 minutes)
    this.checkInterval = setInterval(() => {
      this.checkVersion();
    }, 5 * 60 * 1000);

    // Écouter les événements de focus pour vérifier lors du retour sur l'onglet
    window.addEventListener('focus', () => {
      this.checkVersion();
    });
  }

  private async checkVersion() {
    try {
      // Vérifier si le fichier principal a changé (technique simple)
      const response = await fetch('/index.html', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const lastModified = response.headers.get('last-modified');
      const storedLastModified = localStorage.getItem('app_last_modified');
      
      if (lastModified && storedLastModified && lastModified !== storedLastModified) {
        console.log('Nouvelle version détectée');
        this.handleUpdate();
        return;
      }
      
      // Stocker la date de modification actuelle
      if (lastModified) {
        localStorage.setItem('app_last_modified', lastModified);
      }
      
    } catch (error) {
      console.warn('Erreur lors de la vérification de version:', error);
    }
  }

  private handleUpdate() {
    // Afficher une notification de mise à jour
    this.showUpdateNotification();
    
    // Nettoyer les intervalles
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  private showUpdateNotification() {
    // Créer une notification non-intrusive
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1890ff;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      max-width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 20px;">🔄</div>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">Mise à jour disponible</div>
          <div style="font-size: 14px; opacity: 0.9;">Une nouvelle version est disponible</div>
        </div>
      </div>
      <button id="update-btn" style="
        background: white;
        color: #1890ff;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        margin-top: 12px;
        cursor: pointer;
        font-weight: 600;
        width: 100%;
      ">Mettre à jour maintenant</button>
    `;
    
    document.body.appendChild(notification);
    
    // Ajouter le style d'animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    // Gérer le clic sur le bouton
    const updateBtn = notification.querySelector('#update-btn');
    if (updateBtn) {
      updateBtn.addEventListener('click', () => {
        this.performUpdate();
      });
    }
    
    // Auto-suppression après 10 secondes
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  // Méthode publique pour forcer une vérification
  public forceCheck() {
    this.checkVersion();
  }

  // Méthode publique pour effectuer une mise à jour
  public performUpdate() {
    // Vider tous les caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Vider le localStorage (sauf les données importantes)
    const importantKeys = ['user_token', 'user_data', 'subscription_status'];
    const keysToKeep: { [key: string]: string } = {};
    
    importantKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) keysToKeep[key] = value;
    });
    
    localStorage.clear();
    
    // Restaurer les données importantes
    Object.entries(keysToKeep).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    // Recharger la page
    window.location.reload();
  }

  // Méthode pour arrêter le service
  public destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

export default VersionService; 