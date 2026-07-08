export function rgbaToCss(r: number, g: number, b: number, a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}

export function rgbaToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const value = match[1]!;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
    a: 255,
  };
}

export function findNearestPaletteIndex(
  r: number,
  g: number,
  b: number,
  a: number,
  palette: { r: number; g: number; b: number; a: number }[],
): number {
  if (a < 128) return 0;

  let bestIndex = 1;
  let bestDist = Infinity;

  for (let i = 1; i < palette.length; i++) {
    const c = palette[i]!;
    const dr = r - c.r;
    const dg = g - c.g;
    const db = b - c.b;
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = i;
    }
  }

  return bestIndex;
}
