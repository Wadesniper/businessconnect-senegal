/**
 * Valide un numéro de téléphone international
 * @param phoneNumber Le numéro de téléphone à valider
 * @returns Le numéro si valide, null sinon
 */
export function validatePhoneNumber(phoneNumber: string): string | null {
  // Supprimer les espaces
  const cleaned = phoneNumber.replace(/\s/g, '');

  // Vérifier le format international : +XXXXXXXXXXXXX (minimum 10 chiffres après l'indicatif)
  // L'indicatif doit commencer par + et avoir entre 1 et 4 chiffres
  const isValidInternational = /^\+\d{1,4}\d{10,}$/.test(cleaned);
  
  if (!isValidInternational) {
    return null;
  }

  return cleaned;
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