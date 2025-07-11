import type { User } from '../types/user';

export const hasAdminAccess = (user: User | null): boolean => {
  if (!user) return false;
  return user.role === 'admin';
};

export const hasAdminAccessFromStorage = (): boolean => {
  const localUserStr = localStorage.getItem('user');
  if (!localUserStr) return false;
  
  try {
    const localUser = JSON.parse(localUserStr) as User;
    return localUser.role === 'admin';
  } catch {
    return false;
  }
};

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
  // Si aucun user n'est chargé mais qu'un token existe, on accorde l'accès (cas admin après purge)
  if (!user && localStorage.getItem('auth_token')) return true;
  // Accès premium garanti pour les abonnés actifs
  if (user && isSubscribed) return true;
  // Plus d'accès si user est null, même si token existe
  return false;
} 