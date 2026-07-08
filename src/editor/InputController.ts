import type { Editor } from './Editor';

export class InputController {
  private canvas: HTMLCanvasElement;
  private editor: Editor;
  private lastPinchDistance = 0;
  private pointers = new Map<number, { x: number; y: number }>();
  private drawing = false;

  constructor(canvas: HTMLCanvasElement, editor: Editor) {
    this.canvas = canvas;
    this.editor = editor;
    this.bindEvents();
  }

  destroy(): void {
    this.unbindEvents();
  }

  private bindEvents(): void {
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointercancel', this.onPointerUp);
    this.canvas.addEventListener('pointerleave', this.onPointerLeave);
    this.canvas.addEventListener('wheel', this.onWheel, { passive: false });
    this.canvas.addEventListener('contextmenu', this.onContextMenu);
  }

  private unbindEvents(): void {
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerUp);
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.canvas.removeEventListener('contextmenu', this.onContextMenu);
  }

  private getCanvasPoint(e: PointerEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private onPointerDown = (e: PointerEvent): void => {
    const point = this.getCanvasPoint(e);
    this.pointers.set(e.pointerId, point);

    if (this.pointers.size === 2) {
      this.drawing = false;
      this.lastPinchDistance = this.getPinchDistance();
      return;
    }

    if (e.button === 0) {
      e.preventDefault();
      this.drawing = true;
      this.canvas.setPointerCapture(e.pointerId);
      this.editor.handlePointerDown(point.x, point.y, e.button, e.pressure);
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    const point = this.getCanvasPoint(e);
    if (this.pointers.has(e.pointerId)) {
      this.pointers.set(e.pointerId, point);
    }

    if (this.pointers.size === 2) {
      const distance = this.getPinchDistance();
      if (this.lastPinchDistance > 0) {
        const factor = distance / this.lastPinchDistance;
        this.editor.zoomBy(factor);
      }
      this.lastPinchDistance = distance;
      return;
    }

    if (this.drawing) {
      this.editor.handlePointerMove(point.x, point.y, e.button, e.pressure);
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    const point = this.getCanvasPoint(e);
    this.pointers.delete(e.pointerId);

    if (this.pointers.size < 2) {
      this.lastPinchDistance = 0;
    }

    if (this.drawing) {
      this.drawing = false;
      this.editor.handlePointerUp(point.x, point.y, e.button, e.pressure);
      if (this.canvas.hasPointerCapture(e.pointerId)) {
        this.canvas.releasePointerCapture(e.pointerId);
      }
    }
  };

  private onPointerLeave = (): void => {
    if (this.drawing) {
      this.drawing = false;
      this.editor.cancelTool();
    }
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    this.editor.zoomBy(factor);
  };

  private onContextMenu = (e: Event): void => {
    e.preventDefault();
  };

  private getPinchDistance(): number {
    const pts = [...this.pointers.values()];
    if (pts.length < 2) return 0;
    const [a, b] = pts;
    const dx = a!.x - b!.x;
    const dy = a!.y - b!.y;
    return Math.hypot(dx, dy);
  }
}
