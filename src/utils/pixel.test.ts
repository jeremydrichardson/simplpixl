import { describe, it, expect } from 'vitest';
import { Camera } from '../editor/Camera';
import { History } from '../editor/History';
import { Document } from '../model/Document';
import { clearLayerPixels, floodFillLayer } from '../utils/pixel';

describe('Camera', () => {
  it('converts screen to pixel coordinates', () => {
    const camera = new Camera();
    camera.zoom = 10;
    camera.panX = 5;
    camera.panY = 5;
    const pixel = camera.screenToPixel(15, 25);
    expect(pixel).toEqual({ x: 1, y: 2 });
  });

  it('converts pixel to screen coordinates', () => {
    const camera = new Camera();
    camera.zoom = 10;
    camera.panX = 5;
    camera.panY = 5;
    const screen = camera.pixelToScreen(1, 2);
    expect(screen).toEqual({ x: 15, y: 25 });
  });
});

describe('History', () => {
  it('undoes and redoes pixel changes', () => {
    const doc = Document.create(4, 4);
    const layer = doc.getActiveLayer();
    const history = new History();

    layer.setPixel(1, 1, 5);
    history.record([{ layerId: layer.id, x: 1, y: 1, before: 0, after: 5 }]);

    expect(layer.getPixel(1, 1)).toBe(5);
    history.undo(doc);
    expect(layer.getPixel(1, 1)).toBe(0);
    history.redo(doc);
    expect(layer.getPixel(1, 1)).toBe(5);
  });
});

describe('clearLayerPixels', () => {
  it('clears all non-transparent pixels', () => {
    const doc = Document.create(4, 4);
    const layer = doc.getActiveLayer();
    layer.setPixel(0, 0, 1);
    layer.setPixel(1, 1, 3);
    layer.setPixel(2, 2, 0);

    const changes = clearLayerPixels(layer, layer.id);
    expect(changes).toHaveLength(2);
    expect(layer.getPixel(0, 0)).toBe(0);
    expect(layer.getPixel(1, 1)).toBe(0);
    expect(layer.getPixel(2, 2)).toBe(0);
  });

  it('returns no changes for an already empty layer', () => {
    const doc = Document.create(4, 4);
    const layer = doc.getActiveLayer();
    expect(clearLayerPixels(layer, layer.id)).toHaveLength(0);
  });
});

describe('floodFillLayer', () => {
  it('fills connected region', () => {
    const doc = Document.create(4, 4);
    const layer = doc.getActiveLayer();
    layer.setPixel(1, 1, 1);
    layer.setPixel(2, 1, 1);

    const changes = floodFillLayer(layer, 1, 1, 2, layer.id);
    expect(changes.length).toBe(2);
    expect(layer.getPixel(1, 1)).toBe(2);
    expect(layer.getPixel(2, 1)).toBe(2);
  });
});
