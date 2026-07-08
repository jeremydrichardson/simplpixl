import { Document } from './Document';
import { Frame } from './Frame';
import { Layer } from './Layer';
import { Palette } from './Palette';

export const PROJECT_FORMAT_VERSION = 1;

export interface SerializedLayer {
  id: string;
  name: string;
  width: number;
  height: number;
  pixels: string;
  visible: boolean;
  opacity: number;
}

export interface SerializedFrame {
  layers: SerializedLayer[];
}

export interface SerializedDocument {
  version: number;
  id: string;
  name: string;
  width: number;
  height: number;
  palette: { r: number; g: number; b: number; a: number }[];
  frames: SerializedFrame[];
  activeFrameIndex: number;
}

function encodePixels(pixels: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < pixels.length; i++) {
    binary += String.fromCharCode(pixels[i]!);
  }
  return btoa(binary);
}

function decodePixels(encoded: string, length: number): Uint8Array {
  const binary = atob(encoded);
  const pixels = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    pixels[i] = binary.charCodeAt(i);
  }
  return pixels;
}

export function serializeDocument(doc: Document): SerializedDocument {
  return {
    version: PROJECT_FORMAT_VERSION,
    id: doc.id,
    name: doc.name,
    width: doc.width,
    height: doc.height,
    palette: doc.palette.colors.map((c) => ({ ...c })),
    activeFrameIndex: doc.activeFrameIndex,
    frames: doc.frames.map((frame) => ({
      layers: frame.layers.map((layer) => ({
        id: layer.id,
        name: layer.name,
        width: layer.width,
        height: layer.height,
        pixels: encodePixels(layer.pixels),
        visible: layer.visible,
        opacity: layer.opacity,
      })),
    })),
  };
}

export function deserializeDocument(data: SerializedDocument): Document {
  const palette = new Palette(data.palette);
  const frames = data.frames.map(
    (frame) =>
      new Frame(
        frame.layers.map(
          (layer) =>
            new Layer({
              id: layer.id,
              name: layer.name,
              width: layer.width,
              height: layer.height,
              pixels: decodePixels(layer.pixels, layer.width * layer.height),
              visible: layer.visible,
              opacity: layer.opacity,
            }),
        ),
      ),
  );

  const doc = new Document({
    id: data.id,
    name: data.name,
    width: data.width,
    height: data.height,
    palette,
    frames,
  });
  doc.activeFrameIndex = data.activeFrameIndex;
  return doc;
}

export function documentToJson(doc: Document): string {
  return JSON.stringify(serializeDocument(doc), null, 2);
}

export function documentFromJson(json: string): Document {
  const data = JSON.parse(json) as SerializedDocument;
  return deserializeDocument(data);
}
