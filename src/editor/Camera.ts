const MIN_ZOOM = 1;
const MAX_ZOOM = 64;

export class Camera {
  zoom = 1;
  panX = 0;
  panY = 0;
  viewportWidth = 0;
  viewportHeight = 0;
  documentWidth = 32;
  documentHeight = 32;

  setViewport(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.recenter();
  }

  setDocumentSize(width: number, height: number): void {
    this.documentWidth = width;
    this.documentHeight = height;
    this.recenter();
  }

  screenToPixel(sx: number, sy: number): { x: number; y: number } {
    return {
      x: Math.floor((sx - this.panX) / this.zoom),
      y: Math.floor((sy - this.panY) / this.zoom),
    };
  }

  pixelToScreen(px: number, py: number): { x: number; y: number } {
    return {
      x: px * this.zoom + this.panX,
      y: py * this.zoom + this.panY,
    };
  }

  zoomBy(factor: number): void {
    this.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom * factor));
    this.recenter();
  }

  recenter(): void {
    if (this.viewportWidth === 0 || this.viewportHeight === 0) return;
    this.panX = (this.viewportWidth - this.documentWidth * this.zoom) / 2;
    this.panY = (this.viewportHeight - this.documentHeight * this.zoom) / 2;
  }

  fitToView(): void {
    if (this.viewportWidth === 0 || this.viewportHeight === 0) return;
    const scaleX = this.viewportWidth / this.documentWidth;
    const scaleY = this.viewportHeight / this.documentHeight;
    this.zoom = Math.min(scaleX, scaleY, MAX_ZOOM);
    this.zoom = Math.max(this.zoom, MIN_ZOOM);
    this.recenter();
  }

  getZoomPercent(): number {
    return Math.round(this.zoom * 100);
  }
}
