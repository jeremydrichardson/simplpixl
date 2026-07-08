import { Layer } from './Layer';

export class Frame {
  readonly layers: Layer[];

  constructor(layers: Layer[]) {
    this.layers = layers;
  }

  static create(width: number, height: number): Frame {
    return new Frame([Layer.create(width, height, 'Layer 1')]);
  }

  clone(): Frame {
    return new Frame(this.layers.map((l) => l.clone()));
  }
}
