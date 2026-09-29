export function stringToHslColor(str: string): string {
  let hash = 0x811c9dc5;
  const fnvPrime = 0x01000193;

  for (let i = 0; i < str.length; i++) {
    // XOR avec le code du caractère, puis multiplication par le nombre premier FNV
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, fnvPrime); // Math.imul assure une multiplication 32-bit propre
  }

  // Distribution parfaite sur 360 degrés
  const hue = Math.abs(hash) % 360;

  return `hsl(${hue}, 90%, 30%)`;
}

export function initials(name: string): string {
  const parts = name
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  // "CyberNinja" -> "CN"
  const camel = name.match(/[A-Z][a-z]*/g);
  if (camel && camel.length > 1) {
    return (camel[0][0] + camel[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
