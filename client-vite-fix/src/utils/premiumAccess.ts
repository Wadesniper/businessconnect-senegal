export function hasPremiumAccess(user: any, isSubscribed: boolean): boolean {
  // Accès premium garanti pour l'admin, même si user est partiellement chargé
  if (user && (user.role === 'admin' || user.role === 'superadmin')) return true;
  // Accès premium garanti pour les abonnés actifs
  if (isSubscribed) return true;
  // Si user est null mais le token existe (session en cours), on laisse passer pour éviter le blocage
  if (!user && localStorage.getItem('token')) return true;
  return false;
} 