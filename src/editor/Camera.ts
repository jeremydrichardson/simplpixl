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
  }

  setDocumentSize(width: number, height: number): void {
    this.documentWidth = width;
    this.documentHeight = height;
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

  zoomAtPoint(factor: number, sx: number, sy: number): void {
    const before = this.screenToPixel(sx, sy);
    this.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom * factor));
    const after = this.pixelToScreen(before.x, before.y);
    this.panX += sx - after.x;
    this.panY += sy - after.y;
  }

  panBy(dx: number, dy: number): void {
    this.panX += dx;
    this.panY += dy;
  }

  fitToView(): void {
    if (this.viewportWidth === 0 || this.viewportHeight === 0) return;
    const scaleX = this.viewportWidth / this.documentWidth;
    const scaleY = this.viewportHeight / this.documentHeight;
    this.zoom = Math.min(scaleX, scaleY, MAX_ZOOM);
    this.zoom = Math.max(this.zoom, MIN_ZOOM);
    this.panX = (this.viewportWidth - this.documentWidth * this.zoom) / 2;
    this.panY = (this.viewportHeight - this.documentHeight * this.zoom) / 2;
  }

  getZoomPercent(): number {
    return Math.round(this.zoom * 100);
  }
}
