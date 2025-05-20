export function hasPremiumAccess(user: any, isSubscribed: boolean): boolean {
  // Accès premium garanti pour l'admin, même si user est partiellement chargé
  if (user && (user.role === 'admin' || user.role === 'superadmin')) return true;
  // Vérification locale si user pas encore chargé
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const localUser = JSON.parse(userStr);
      if (localUser && (localUser.role === 'admin' || localUser.role === 'superadmin')) return true;
    }
  } catch {}
  // Accès premium garanti pour les abonnés actifs
  if (user && isSubscribed) return true;
  // Plus d'accès si user est null, même si token existe
  return false;
} 