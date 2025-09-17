const MIN_LENGTH = 8;
const LENGTH_WEIGHT = 40;
const UPPER_WEIGHT = 15;
const LOWER_WEIGHT = 15;
const DIGIT_WEIGHT = 15;
const SPECIAL_WEIGHT = 15;

const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

export function calculateStrength(password: string): number {
  if (!password) return 0;

  if (password.length < MIN_LENGTH) {
    return (password.length / MIN_LENGTH) * LENGTH_WEIGHT;
  }

  let strength = LENGTH_WEIGHT;

  if (UPPERCASE_REGEX.test(password)) strength += UPPER_WEIGHT;
  if (LOWERCASE_REGEX.test(password)) strength += LOWER_WEIGHT;
  if (DIGIT_REGEX.test(password)) strength += DIGIT_WEIGHT;
  if (SPECIAL_CHAR_REGEX.test(password)) strength += SPECIAL_WEIGHT;

  return Math.min(strength, 100);
}

const WEAK_THRESHOLD = 60;
const MEDIUM_THRESHOLD = 86;

export function getStrengthColor(strength: number): string {
  if (strength < WEAK_THRESHOLD) return 'bg-danger';
  if (strength < MEDIUM_THRESHOLD) return 'bg-warning';
  return 'bg-success';
}
