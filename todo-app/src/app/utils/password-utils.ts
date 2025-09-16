export function calculateStrength(password: string): number {
  let strength = 0;

  if (!password) return 0;

  // LONGUEUR : priorité
  if (password.length >= 8) {
    strength += 40; 
  } else {
    return (password.length / 8) * 40; 
  }

  // AUTRES CRITÈRES
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[a-z]/.test(password)) strength += 15;
  if (/\d/.test(password)) strength += 15;
  if (/[^A-Za-z0-9]/.test(password)) strength += 15;

  return Math.min(strength, 100);
}

export function getStrengthColor(strength: number): string {
  if (strength < 60) return 'bg-danger';   
  if (strength < 86) return 'bg-warning'; 
  return 'bg-success';                     
}
