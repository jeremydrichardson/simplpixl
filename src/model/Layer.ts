import { generateId } from '../utils/id';

export interface LayerData {
  id: string;
  name: string;
  width: number;
  height: number;
  pixels: Uint8Array;
  visible: boolean;
  opacity: number;
}

export class Layer {
  readonly id: string;
  name: string;
  readonly width: number;
  readonly height: number;
  readonly pixels: Uint8Array;
  visible: boolean;
  opacity: number;

  constructor(data: LayerData) {
    this.id = data.id;
    this.name = data.name;
    this.width = data.width;
    this.height = data.height;
    this.pixels = data.pixels;
    this.visible = data.visible;
    this.opacity = data.opacity;
  }

  static create(width: number, height: number, name = 'Layer'): Layer {
    return new Layer({
      id: generateId(),
      name,
      width,
      height,
      pixels: new Uint8Array(width * height),
      visible: true,
      opacity: 1,
    });
  }

  getPixel(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return 0;
    return this.pixels[y * this.width + x] ?? 0;
  }

  setPixel(x: number, y: number, index: number): void {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    this.pixels[y * this.width + x] = index;
  }

  clone(): Layer {
    return new Layer({
      id: generateId(),
      name: this.name,
      width: this.width,
      height: this.height,
      pixels: new Uint8Array(this.pixels),
      visible: this.visible,
      opacity: this.opacity,
    });
  }
}
