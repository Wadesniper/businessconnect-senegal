/**
 * Valide et normalise un numéro de téléphone sénégalais
 * @param phoneNumber Le numéro de téléphone à valider
 * @returns Le numéro normalisé ou null si invalide
 */
export function validatePhoneNumber(phoneNumber: string): string | null {
  // Supprimer tous les espaces et caractères spéciaux
  const cleaned = phoneNumber.replace(/\s+/g, '').replace(/[-()+]/g, '');

  // Si le numéro commence par +221, le retirer
  const withoutPrefix = cleaned.startsWith('221') ? cleaned.slice(3) : cleaned;

  // Vérifier que le numéro commence par 70, 76, 77 ou 78 et a 9 chiffres
  const isValid = /^(70|76|77|78)\d{7}$/.test(withoutPrefix);

  if (!isValid) {
    return null;
  }

  // Retourner le numéro au format international
  return `+221${withoutPrefix}`;
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