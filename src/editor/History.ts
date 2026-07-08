import type { Document } from '../model/Document';
import type { PixelChange } from '../utils/pixel';

export class History {
  private undoStack: PixelChange[][] = [];
  private redoStack: PixelChange[][] = [];

  record(changes: PixelChange[]): void {
    if (changes.length === 0) return;
    this.undoStack.push(changes);
    this.redoStack = [];
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  undo(document: Document): boolean {
    const changes = this.undoStack.pop();
    if (!changes) return false;

    for (let i = changes.length - 1; i >= 0; i--) {
      const change = changes[i]!;
      const layer = document.getLayerById(change.layerId);
      if (layer) layer.setPixel(change.x, change.y, change.before);
    }

    this.redoStack.push(changes);
    return true;
  }

  redo(document: Document): boolean {
    const changes = this.redoStack.pop();
    if (!changes) return false;

    for (const change of changes) {
      const layer = document.getLayerById(change.layerId);
      if (layer) layer.setPixel(change.x, change.y, change.after);
    }

    this.undoStack.push(changes);
    return true;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}
