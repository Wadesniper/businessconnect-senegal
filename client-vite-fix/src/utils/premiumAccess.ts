export function hasPremiumAccess(user: any, isSubscribed: boolean): boolean {
  return user?.role === 'admin' || isSubscribed;
} 