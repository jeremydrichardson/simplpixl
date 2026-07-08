import type { Document } from '../model/Document';
import type { Camera } from './Camera';
import { rgbaToCss } from '../utils/color';

export interface RenderOptions {
  showGrid: boolean;
  gridZoomThreshold: number;
  whiteBackground: boolean;
}

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
  }

  resize(width: number, height: number): void {
    this.dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  render(document: Document, camera: Camera, options: RenderOptions): void {
    const { ctx } = this;
    const vw = camera.viewportWidth;
    const vh = camera.viewportHeight;

    ctx.clearRect(0, 0, vw, vh);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, vw, vh);

    this.drawCheckerboard(camera, options.whiteBackground);
    this.drawDocument(document, camera);

    if (options.showGrid && camera.zoom >= options.gridZoomThreshold) {
      this.drawGrid(document, camera, options.whiteBackground);
    }
  }

  private drawCheckerboard(camera: Camera, whiteBackground: boolean): void {
    const { ctx } = this;
    const tileSize = camera.zoom;
    const docW = camera.documentWidth * camera.zoom;
    const docH = camera.documentHeight * camera.zoom;
    const startX = camera.panX;
    const startY = camera.panY;

    if (whiteBackground) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(startX, startY, docW, docH);
    } else {
      const cols = camera.documentWidth;
      const rows = camera.documentHeight;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const isLight = (x + y) % 2 === 0;
          ctx.fillStyle = isLight ? '#2a2a2a' : '#222222';
          ctx.fillRect(startX + x * tileSize, startY + y * tileSize, tileSize, tileSize);
        }
      }
    }

    ctx.strokeStyle = whiteBackground ? '#ccc' : '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, startY, docW, docH);
  }

  private drawDocument(document: Document, camera: Camera): void {
    const { ctx } = this;
    const frame = document.getActiveFrame();
    const palette = document.palette;

    for (const layer of frame.layers) {
      if (!layer.visible || layer.opacity <= 0) continue;

      const { width, height, pixels } = layer;
      const alpha = layer.opacity;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = pixels[y * width + x]!;
          if (index === 0) continue;

          const color = palette.getColor(index);
          if (color.a === 0) continue;

          const screen = camera.pixelToScreen(x, y);
          ctx.fillStyle =
            alpha < 1
              ? rgbaToCss(color.r, color.g, color.b, color.a * alpha)
              : rgbaToCss(color.r, color.g, color.b, color.a);
          ctx.fillRect(screen.x, screen.y, camera.zoom, camera.zoom);
        }
      }
    }
  }

  private drawGrid(document: Document, camera: Camera, whiteBackground: boolean): void {
    const { ctx } = this;
    const { width, height } = document;
    ctx.strokeStyle = whiteBackground ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x <= width; x++) {
      const screen = camera.pixelToScreen(x, 0);
      const bottom = camera.pixelToScreen(x, height);
      ctx.moveTo(screen.x + 0.5, camera.panY);
      ctx.lineTo(bottom.x + 0.5, bottom.y);
    }

    for (let y = 0; y <= height; y++) {
      const screen = camera.pixelToScreen(0, y);
      const right = camera.pixelToScreen(width, y);
      ctx.moveTo(camera.panX, screen.y + 0.5);
      ctx.lineTo(right.x, right.y + 0.5);
    }

    ctx.stroke();
  }
}
