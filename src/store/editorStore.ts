import { create } from 'zustand';
import type { ToolId } from '../editor/Editor';

interface EditorStore {
  activeTool: ToolId;
  primaryColorIndex: number;
  secondaryColorIndex: number;
  showGrid: boolean;
  gridZoomThreshold: number;
  whiteBackground: boolean;
  activeLayerId: string | null;
  zoomPercent: number;
  showProjectBrowser: boolean;
  canUndo: boolean;

  setActiveTool: (tool: ToolId) => void;
  setPrimaryColorIndex: (index: number) => void;
  setSecondaryColorIndex: (index: number) => void;
  setShowGrid: (show: boolean) => void;
  setGridZoomThreshold: (threshold: number) => void;
  setWhiteBackground: (white: boolean) => void;
  setActiveLayerId: (id: string | null) => void;
  setZoomPercent: (percent: number) => void;
  setShowProjectBrowser: (show: boolean) => void;
  setCanUndo: (canUndo: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  activeTool: 'pencil',
  primaryColorIndex: 1,
  secondaryColorIndex: 2,
  showGrid: true,
  gridZoomThreshold: 8,
  whiteBackground: false,
  activeLayerId: null,
  zoomPercent: 100,
  showProjectBrowser: false,
  canUndo: false,

  setActiveTool: (tool) => set({ activeTool: tool }),
  setPrimaryColorIndex: (index) => set({ primaryColorIndex: index }),
  setSecondaryColorIndex: (index) => set({ secondaryColorIndex: index }),
  setShowGrid: (show) => set({ showGrid: show }),
  setGridZoomThreshold: (threshold) => set({ gridZoomThreshold: threshold }),
  setWhiteBackground: (white) => set({ whiteBackground: white }),
  setActiveLayerId: (id) => set({ activeLayerId: id }),
  setZoomPercent: (percent) => set({ zoomPercent: percent }),
  setShowProjectBrowser: (show) => set({ showProjectBrowser: show }),
  setCanUndo: (canUndo) => set({ canUndo }),
}));
