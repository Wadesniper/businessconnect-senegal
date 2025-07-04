// Service de détection de nouvelle version (zéro régression)
class VersionService {
  private static lastModified: string | null = null;
  private static interval: any = null;

  static start() {
    // Vérifie toutes les 2 minutes
    this.check();
    this.interval = setInterval(() => this.check(), 2 * 60 * 1000);
  }

  static async check() {
    try {
      const res = await fetch('/index.html', { method: 'HEAD', cache: 'no-cache' });
      const lastMod = res.headers.get('last-modified');
      if (this.lastModified && lastMod && this.lastModified !== lastMod) {
        // Nouvelle version détectée
        window.location.reload();
      }
      if (lastMod) this.lastModified = lastMod;
    } catch (e) {
      // Ne rien faire en cas d'erreur réseau
    }
  }
}

export default VersionService; 