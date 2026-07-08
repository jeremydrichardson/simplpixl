import type { Tool, ToolContext, PointerState } from './Tool';
import { clampPixel } from './Tool';
import { floodFillLayer } from '../../utils/pixel';

export class FillTool implements Tool {
  readonly id = 'fill';

  pointerDown(ctx: ToolContext, e: PointerState): void {
    const pixel = clampPixel(e.x, e.y, ctx.activeLayer.width, ctx.activeLayer.height);
    if (!pixel) return;

    const changes = floodFillLayer(
      ctx.activeLayer,
      pixel.x,
      pixel.y,
      ctx.colorIndex,
      ctx.activeLayer.id,
    );

    ctx.applyChanges(changes);
    ctx.requestRender();
  }

  pointerMove(_ctx: ToolContext, _e: PointerState): void {
    void _ctx;
    void _e;
  }

  pointerUp(_ctx: ToolContext, _e: PointerState): void {
    void _ctx;
    void _e;
  }

  cancel(_ctx: ToolContext): void {
    void _ctx;
  }
}
