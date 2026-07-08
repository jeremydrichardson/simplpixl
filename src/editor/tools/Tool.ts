import type { Document } from '../../model/Document';
import type { Layer } from '../../model/Layer';
import type { Camera } from '../Camera';
import type { History } from '../History';
import type { PixelChange } from '../../utils/pixel';

export interface PointerState {
  x: number;
  y: number;
  button: number;
  pressure: number;
}

export interface ToolContext {
  document: Document;
  activeLayer: Layer;
  colorIndex: number;
  camera: Camera;
  history: History;
  requestRender: () => void;
  applyChanges: (changes: PixelChange[]) => void;
}

export interface Tool {
  readonly id: string;
  pointerDown(ctx: ToolContext, e: PointerState): void;
  pointerMove(ctx: ToolContext, e: PointerState): void;
  pointerUp(ctx: ToolContext, e: PointerState): void;
  cancel(ctx: ToolContext): void;
}

export function clampPixel(
  x: number,
  y: number,
  width: number,
  height: number,
): { x: number; y: number } | null {
  if (x < 0 || y < 0 || x >= width || y >= height) return null;
  return { x, y };
}
