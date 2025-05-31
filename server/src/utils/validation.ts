/**
 * Valide et normalise un numéro de téléphone sénégalais
 * @param phone Le numéro de téléphone à valider
 * @returns Le numéro normalisé au format international ou null si invalide
 */
export function validatePhoneNumber(phone: string): string | null {
  if (!phone) return null;
  
  // Nettoie le numéro en gardant uniquement les chiffres et le +
  let cleaned = phone.replace(/[^0-9+]/g, '');
  
  // Si le numéro commence par +221
  if (cleaned.startsWith('+221')) {
    const digits = cleaned.slice(4); // Enlève le +221
    if (/^(70|76|77|78)[0-9]{7}$/.test(digits)) {
      return cleaned;
    }
    return null;
  }
  
  // Si le numéro commence par un préfixe valide (format local)
  if (/^(70|76|77|78)[0-9]{7}$/.test(cleaned)) {
    return '+221' + cleaned;
  }
  
  return null;
}

/**
 * Valide un email
 * @param email L'email à valider
 * @returns true si l'email est valide, false sinon
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valide un mot de passe
 * @param password Le mot de passe à valider
 * @returns true si le mot de passe est valide, false sinon
 */
export function validatePassword(password: string): boolean {
  return password.length >= 6;
} 