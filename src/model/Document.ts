import { Frame } from './Frame';
import { Palette } from './Palette';
import type { Layer } from './Layer';
import { generateId } from '../utils/id';

export interface DocumentData {
  id: string;
  name: string;
  width: number;
  height: number;
  palette: Palette;
  frames: Frame[];
}

export class Document {
  readonly id: string;
  name: string;
  readonly width: number;
  readonly height: number;
  palette: Palette;
  readonly frames: Frame[];
  activeFrameIndex: number;

  constructor(data: DocumentData) {
    this.id = data.id;
    this.name = data.name;
    this.width = data.width;
    this.height = data.height;
    this.palette = data.palette;
    this.frames = data.frames;
    this.activeFrameIndex = 0;
  }

  static create(width: number, height: number, name = 'Untitled'): Document {
    return new Document({
      id: generateId(),
      name,
      width,
      height,
      palette: new Palette(),
      frames: [Frame.create(width, height)],
    });
  }

  getActiveFrame(): Frame {
    return this.frames[this.activeFrameIndex]!;
  }

  getActiveLayer(): Layer {
    const frame = this.getActiveFrame();
    return frame.layers[0]!;
  }

  getLayerById(layerId: string): Layer | undefined {
    return this.getActiveFrame().layers.find((l) => l.id === layerId);
  }

  clone(): Document {
    const doc = new Document({
      id: generateId(),
      name: this.name,
      width: this.width,
      height: this.height,
      palette: this.palette.clone(),
      frames: this.frames.map((f) => f.clone()),
    });
    doc.activeFrameIndex = this.activeFrameIndex;
    return doc;
  }
}
