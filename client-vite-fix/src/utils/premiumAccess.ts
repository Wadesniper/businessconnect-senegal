export function hasPremiumAccess(user: any, isSubscribed: boolean): boolean {
  // Accès premium garanti pour l'admin, même si user est partiellement chargé
  if (user && (user.role === 'admin' || user.role === 'superadmin')) return true;
  // Accès premium garanti pour les abonnés actifs
  if (user && isSubscribed) return true;
  // Plus d'accès si user est null, même si token existe
  return false;
} 