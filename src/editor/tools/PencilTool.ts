import type { Tool, ToolContext, PointerState } from './Tool';
import { clampPixel } from './Tool';
import { drawLinePixels } from '../../utils/pixel';
import type { PixelChange } from '../../utils/pixel';

export class PencilTool implements Tool {
  readonly id = 'pencil';
  private lastX = -1;
  private lastY = -1;
  private pendingChanges: PixelChange[] = [];

  pointerDown(ctx: ToolContext, e: PointerState): void {
    this.pendingChanges = [];
    this.lastX = -1;
    this.lastY = -1;
    this.paintAt(ctx, e);
  }

  pointerMove(ctx: ToolContext, e: PointerState): void {
    this.paintAt(ctx, e);
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
    this.lastX = -1;
    this.lastY = -1;
    ctx.requestRender();
  }

  private paintAt(ctx: ToolContext, e: PointerState): void {
    const pixel = clampPixel(e.x, e.y, ctx.activeLayer.width, ctx.activeLayer.height);
    if (!pixel) return;

    const points =
      this.lastX >= 0
        ? drawLinePixels(this.lastX, this.lastY, pixel.x, pixel.y)
        : [{ x: pixel.x, y: pixel.y }];

    for (const point of points) {
      this.setPixel(ctx, point.x, point.y);
    }

    this.lastX = pixel.x;
    this.lastY = pixel.y;
    ctx.requestRender();
  }

  private setPixel(ctx: ToolContext, x: number, y: number): void {
    const before = ctx.activeLayer.getPixel(x, y);
    const after = ctx.colorIndex;
    if (before === after) return;

    ctx.activeLayer.setPixel(x, y, after);
    this.pendingChanges.push({
      layerId: ctx.activeLayer.id,
      x,
      y,
      before,
      after,
    });
  }
}
