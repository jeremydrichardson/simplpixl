export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

const DEFAULT_COLORS: RgbaColor[] = [
  { r: 0, g: 0, b: 0, a: 0 },
  { r: 0, g: 0, b: 0, a: 255 },
  { r: 255, g: 255, b: 255, a: 255 },
  { r: 255, g: 0, b: 0, a: 255 },
  { r: 255, g: 128, b: 0, a: 255 },
  { r: 255, g: 255, b: 0, a: 255 },
  { r: 0, g: 255, b: 0, a: 255 },
  { r: 0, g: 255, b: 255, a: 255 },
  { r: 0, g: 0, b: 255, a: 255 },
  { r: 128, g: 0, b: 255, a: 255 },
  { r: 255, g: 0, b: 255, a: 255 },
  { r: 128, g: 128, b: 128, a: 255 },
  { r: 192, g: 192, b: 192, a: 255 },
  { r: 128, g: 64, b: 0, a: 255 },
  { r: 64, g: 32, b: 0, a: 255 },
  { r: 255, g: 192, b: 203, a: 255 },
];

export class Palette {
  readonly colors: RgbaColor[];

  constructor(colors?: RgbaColor[]) {
    this.colors = colors ? [...colors] : DEFAULT_COLORS.map((c) => ({ ...c }));
    while (this.colors.length < 256) {
      this.colors.push({ r: 0, g: 0, b: 0, a: 255 });
    }
  }

  getColor(index: number): RgbaColor {
    return this.colors[index] ?? { r: 0, g: 0, b: 0, a: 0 };
  }

  setColor(index: number, color: RgbaColor): void {
    if (index <= 0 || index >= 256) return;
    this.colors[index] = { ...color };
  }

  clone(): Palette {
    return new Palette(this.colors);
  }
}
