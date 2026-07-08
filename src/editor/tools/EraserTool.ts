import type { Tool, ToolContext, PointerState } from './Tool';
import { clampPixel } from './Tool';
import { drawLinePixels } from '../../utils/pixel';
import type { PixelChange } from '../../utils/pixel';

export class EraserTool implements Tool {
  readonly id = 'eraser';
  private lastX = -1;
  private lastY = -1;
  private pendingChanges: PixelChange[] = [];

  pointerDown(ctx: ToolContext, e: PointerState): void {
    this.pendingChanges = [];
    this.lastX = -1;
    this.lastY = -1;
    this.eraseAt(ctx, e);
  }

  pointerMove(ctx: ToolContext, e: PointerState): void {
    this.eraseAt(ctx, e);
  }

  pointerUp(ctx: ToolContext): void {
    ctx.applyChanges(this.pendingChanges);
    this.pendingChanges = [];
    this.lastX = -1;
    this.lastY = -1;
  }

  cancel(ctx: ToolContext): void {
    for (let i = this.pendingChanges.length - 1; i >= 0; i--) {
      const change = this.pendingChanges[i]!;
      ctx.activeLayer.setPixel(change.x, change.y, change.before);
    }
    this.pendingChanges = [];
    ctx.requestRender();
  }

  private eraseAt(ctx: ToolContext, e: PointerState): void {
    const pixel = clampPixel(e.x, e.y, ctx.activeLayer.width, ctx.activeLayer.height);
    if (!pixel) return;

    const points =
      this.lastX >= 0
        ? drawLinePixels(this.lastX, this.lastY, pixel.x, pixel.y)
        : [{ x: pixel.x, y: pixel.y }];

    for (const point of points) {
      const before = ctx.activeLayer.getPixel(point.x, point.y);
      if (before === 0) continue;
      ctx.activeLayer.setPixel(point.x, point.y, 0);
      this.pendingChanges.push({
        layerId: ctx.activeLayer.id,
        x: point.x,
        y: point.y,
        before,
        after: 0,
      });
    }

    this.lastX = pixel.x;
    this.lastY = pixel.y;
    ctx.requestRender();
  }
}
