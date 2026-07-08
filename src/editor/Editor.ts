import { Document } from '../model/Document';
import type { Layer } from '../model/Layer';
import { Camera } from './Camera';
import { History } from './History';
import { Renderer, type RenderOptions } from './Renderer';
import { InputController } from './InputController';
import { PencilTool } from './tools/PencilTool';
import { EraserTool } from './tools/EraserTool';
import { FillTool } from './tools/FillTool';
import type { Tool } from './tools/Tool';
import { clearLayerPixels, type PixelChange } from '../utils/pixel';
import { findNearestPaletteIndex } from '../utils/color';
import { Layer as LayerClass } from '../model/Layer';

export type ToolId = 'pencil' | 'eraser' | 'fill';

export interface EditorOptions {
  width?: number;
  height?: number;
  name?: string;
}

type ChangeListener = () => void;

export class Editor {
  document: Document;
  readonly camera: Camera;
  readonly history: History;
  private renderer: Renderer;
  private inputController: InputController;
  private tools: Map<ToolId, Tool>;
  private activeTool: Tool;
  private activeLayerId: string;
  private listeners: ChangeListener[] = [];
  private renderOptions: RenderOptions = { showGrid: true, gridZoomThreshold: 8, whiteBackground: false };
  private primaryColorIndex = 1;
  private isDirty = false;

  constructor(canvas: HTMLCanvasElement, options: EditorOptions = {}) {
    this.document = Document.create(options.width ?? 32, options.height ?? 32, options.name);
    this.activeLayerId = this.document.getActiveLayer().id;

    this.camera = new Camera();
    this.camera.setDocumentSize(this.document.width, this.document.height);

    this.history = new History();
    this.renderer = new Renderer(canvas);

    const pencil = new PencilTool();
    const eraser = new EraserTool();
    const fill = new FillTool();
    this.tools = new Map<ToolId, Tool>([
      ['pencil', pencil],
      ['eraser', eraser],
      ['fill', fill],
    ]);
    this.activeTool = pencil;

    this.inputController = new InputController(canvas, this);
  }

  destroy(): void {
    this.inputController.destroy();
    this.listeners = [];
  }

  onChange(listener: ChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyChange(): void {
    this.isDirty = true;
    for (const listener of this.listeners) listener();
  }

  getActiveLayer(): Layer {
    const layer = this.document.getLayerById(this.activeLayerId);
    return layer ?? this.document.getActiveLayer();
  }

  setActiveLayer(layerId: string): void {
    if (this.document.getLayerById(layerId)) {
      this.activeLayerId = layerId;
      this.notifyChange();
    }
  }

  setTool(toolId: ToolId): void {
    const tool = this.tools.get(toolId);
    if (tool) {
      this.activeTool.cancel(this.createToolContext());
      this.activeTool = tool;
    }
  }

  setPrimaryColorIndex(index: number): void {
    this.primaryColorIndex = index;
  }

  setRenderOptions(options: Partial<RenderOptions>): void {
    this.renderOptions = { ...this.renderOptions, ...options };
    this.render();
  }

  resize(viewportWidth: number, viewportHeight: number): void {
    this.camera.setViewport(viewportWidth, viewportHeight);
    this.renderer.resize(viewportWidth, viewportHeight);
    if (this.camera.zoom === 1 && this.camera.panX === 0 && this.camera.panY === 0) {
      this.camera.fitToView();
    }
    this.render();
  }

  render(): void {
    this.renderer.render(this.document, this.camera, this.renderOptions);
  }

  fitToView(): void {
    this.camera.fitToView();
    this.render();
    this.notifyChange();
  }

  zoomAtPoint(factor: number, sx: number, sy: number): void {
    this.camera.zoomAtPoint(factor, sx, sy);
    this.render();
    this.notifyChange();
  }

  panBy(dx: number, dy: number): void {
    this.camera.panBy(dx, dy);
    this.render();
    this.notifyChange();
  }

  undo(): boolean {
    const result = this.history.undo(this.document);
    if (result) {
      this.render();
      this.notifyChange();
    }
    return result;
  }

  redo(): boolean {
    const result = this.history.redo(this.document);
    if (result) {
      this.render();
      this.notifyChange();
    }
    return result;
  }

  canUndo(): boolean {
    return this.history.canUndo();
  }

  canRedo(): boolean {
    return this.history.canRedo();
  }

  getZoomPercent(): number {
    return this.camera.getZoomPercent();
  }

  getIsDirty(): boolean {
    return this.isDirty;
  }

  clearDirty(): void {
    this.isDirty = false;
  }

  replaceDocument(document: Document): void {
    this.document = document;
    this.activeLayerId = document.getActiveLayer().id;
    this.camera.setDocumentSize(document.width, document.height);
    this.history.clear();
    this.camera.fitToView();
    this.render();
    this.notifyChange();
  }

  addLayer(name?: string): Layer {
    const layer = LayerClass.create(
      this.document.width,
      this.document.height,
      name ?? `Layer ${this.document.getActiveFrame().layers.length + 1}`,
    );
    this.document.getActiveFrame().layers.push(layer);
    this.activeLayerId = layer.id;
    this.render();
    this.notifyChange();
    return layer;
  }

  removeLayer(layerId: string): boolean {
    const frame = this.document.getActiveFrame();
    if (frame.layers.length <= 1) return false;
    const index = frame.layers.findIndex((l) => l.id === layerId);
    if (index === -1) return false;
    frame.layers.splice(index, 1);
    if (this.activeLayerId === layerId) {
      this.activeLayerId = frame.layers[Math.max(0, index - 1)]!.id;
    }
    this.render();
    this.notifyChange();
    return true;
  }

  moveLayer(layerId: string, toIndex: number): void {
    const frame = this.document.getActiveFrame();
    const fromIndex = frame.layers.findIndex((l) => l.id === layerId);
    if (fromIndex === -1 || toIndex < 0 || toIndex >= frame.layers.length) return;
    const [layer] = frame.layers.splice(fromIndex, 1);
    frame.layers.splice(toIndex, 0, layer!);
    this.render();
    this.notifyChange();
  }

  setLayerVisibility(layerId: string, visible: boolean): void {
    const layer = this.document.getLayerById(layerId);
    if (layer) {
      layer.visible = visible;
      this.render();
      this.notifyChange();
    }
  }

  setLayerOpacity(layerId: string, opacity: number): void {
    const layer = this.document.getLayerById(layerId);
    if (layer) {
      layer.opacity = Math.max(0, Math.min(1, opacity));
      this.render();
      this.notifyChange();
    }
  }

  renameLayer(layerId: string, name: string): void {
    const layer = this.document.getLayerById(layerId);
    if (layer) {
      layer.name = name;
      this.notifyChange();
    }
  }

  clearLayer(layerId?: string): boolean {
    const id = layerId ?? this.activeLayerId;
    const layer = this.document.getLayerById(id);
    if (!layer) return false;

    const changes = clearLayerPixels(layer, id);
    if (changes.length === 0) return false;

    this.history.record(changes);
    this.render();
    this.notifyChange();
    return true;
  }

  exportPNG(): Promise<Blob> {
    const { width, height } = this.document;
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const ctx = offscreen.getContext('2d')!;

    for (const layer of this.document.getActiveFrame().layers) {
      if (!layer.visible) continue;
      const imageData = ctx.createImageData(width, height);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = layer.getPixel(x, y);
          const color = this.document.palette.getColor(index);
          const i = (y * width + x) * 4;
          imageData.data[i] = color.r;
          imageData.data[i + 1] = color.g;
          imageData.data[i + 2] = color.b;
          imageData.data[i + 3] = Math.round(color.a * layer.opacity);
        }
      }
      const layerCanvas = document.createElement('canvas');
      layerCanvas.width = width;
      layerCanvas.height = height;
      layerCanvas.getContext('2d')!.putImageData(imageData, 0, 0);
      ctx.drawImage(layerCanvas, 0, 0);
    }

    return new Promise((resolve, reject) => {
      offscreen.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to export PNG'));
      }, 'image/png');
    });
  }

  async importPNG(file: File): Promise<void> {
    const bitmap = await createImageBitmap(file);
    const { width, height } = this.document;
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const ctx = offscreen.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const layer = this.getActiveLayer();
    const changes: PixelChange[] = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = imageData.data[i]!;
        const g = imageData.data[i + 1]!;
        const b = imageData.data[i + 2]!;
        const a = imageData.data[i + 3]!;
        const index = findNearestPaletteIndex(r, g, b, a, this.document.palette.colors);
        const before = layer.getPixel(x, y);
        if (before !== index) {
          layer.setPixel(x, y, index);
          changes.push({ layerId: layer.id, x, y, before, after: index });
        }
      }
    }

    this.history.record(changes);
    this.render();
    this.notifyChange();
  }

  createToolContext() {
    return {
      document: this.document,
      activeLayer: this.getActiveLayer(),
      colorIndex: this.activeTool.id === 'eraser' ? 0 : this.primaryColorIndex,
      camera: this.camera,
      history: this.history,
      requestRender: () => this.render(),
      applyChanges: (changes: PixelChange[]) => {
        if (changes.length > 0) {
          this.history.record(changes);
          this.notifyChange();
        }
      },
    };
  }

  handlePointerDown(sx: number, sy: number, button: number, pressure: number): void {
    const pixel = this.camera.screenToPixel(sx, sy);
    this.activeTool.pointerDown(this.createToolContext(), {
      x: pixel.x,
      y: pixel.y,
      button,
      pressure,
    });
  }

  handlePointerMove(sx: number, sy: number, button: number, pressure: number): void {
    const pixel = this.camera.screenToPixel(sx, sy);
    this.activeTool.pointerMove(this.createToolContext(), {
      x: pixel.x,
      y: pixel.y,
      button,
      pressure,
    });
  }

  handlePointerUp(sx: number, sy: number, button: number, pressure: number): void {
    const pixel = this.camera.screenToPixel(sx, sy);
    this.activeTool.pointerUp(this.createToolContext(), {
      x: pixel.x,
      y: pixel.y,
      button,
      pressure,
    });
  }

  cancelTool(): void {
    this.activeTool.cancel(this.createToolContext());
  }

  setPanMode(enabled: boolean): void {
    this.inputController.setSpaceHeld(enabled);
  }
}
