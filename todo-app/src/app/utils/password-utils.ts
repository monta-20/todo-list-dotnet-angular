// Paramètres de scoring
const MIN_LENGTH = 8;
const LENGTH_WEIGHT = 40;
const CRITERIA_WEIGHT = 15;
const MAX_STRENGTH = 100;

// Expressions régulières pour les critères
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

// Seuils d'affichage
const DANGER_THRESHOLD = 60;
const WARNING_THRESHOLD = 86;

/**
 * Calcule un score de robustesse de 0 à 100.
 * Priorité à la longueur: si la longueur est < MIN_LENGTH,
 * retourne uniquement une proportion du poids de longueur.
 */
export function calculateStrength(password: string): number {
  if (!password) return 0;

  if (password.length < MIN_LENGTH) {
    const proportionalLengthScore = (password.length / MIN_LENGTH) * LENGTH_WEIGHT;
    return proportionalLengthScore;
  }

  let strength = LENGTH_WEIGHT;

  if (UPPERCASE_REGEX.test(password)) strength += CRITERIA_WEIGHT;
  if (LOWERCASE_REGEX.test(password)) strength += CRITERIA_WEIGHT;
  if (DIGIT_REGEX.test(password)) strength += CRITERIA_WEIGHT;
  if (SPECIAL_CHAR_REGEX.test(password)) strength += CRITERIA_WEIGHT;

  return Math.min(strength, MAX_STRENGTH);
}

/** Retourne une classe CSS Bootstrap en fonction du score. */
export function getStrengthColor(strength: number): string {
  if (strength < DANGER_THRESHOLD) return 'bg-danger';
  if (strength < WARNING_THRESHOLD) return 'bg-warning';
  return 'bg-success';
}
