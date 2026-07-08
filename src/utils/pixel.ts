import type { Layer } from '../model/Layer';

export interface PixelChange {
  layerId: string;
  x: number;
  y: number;
  before: number;
  after: number;
}

export function floodFillLayer(
  layer: Layer,
  startX: number,
  startY: number,
  fillIndex: number,
  layerId: string,
): PixelChange[] {
  const targetIndex = layer.getPixel(startX, startY);
  if (targetIndex === fillIndex) return [];

  const { width, height } = layer;
  const stack: [number, number][] = [[startX, startY]];
  const visited = new Uint8Array(width * height);
  const changes: PixelChange[] = [];

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    if (x < 0 || y < 0 || x >= width || y >= height) continue;

    const idx = y * width + x;
    if (visited[idx]) continue;
    if (layer.getPixel(x, y) !== targetIndex) continue;

    visited[idx] = 1;
    layer.setPixel(x, y, fillIndex);
    changes.push({ layerId, x, y, before: targetIndex, after: fillIndex });

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  return changes;
}

export function clearLayerPixels(layer: Layer, layerId: string): PixelChange[] {
  const { width, height } = layer;
  const changes: PixelChange[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const before = layer.getPixel(x, y);
      if (before === 0) continue;
      layer.setPixel(x, y, 0);
      changes.push({ layerId, x, y, before, after: 0 });
    }
  }

  return changes;
}

export function drawLinePixels(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0;
  let y = y0;

  while (true) {
    points.push({ x, y });
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

  return points;
}
