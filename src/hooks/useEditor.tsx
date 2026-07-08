import { createContext, useContext, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { Editor } from '../editor/Editor';
import { useEditorStore } from '../store/editorStore';
import { createKeyboardManager, registerModShortcut } from '../utils/keyboard';

interface EditorContextValue {
  getEditor: () => Editor | null;
  resize: (width: number, height: number) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({
  canvasRef,
  children,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  children: ReactNode;
}) {
  const editorRef = useRef<Editor | null>(null);

  const activeTool = useEditorStore((s) => s.activeTool);
  const primaryColorIndex = useEditorStore((s) => s.primaryColorIndex);
  const showGrid = useEditorStore((s) => s.showGrid);
  const gridZoomThreshold = useEditorStore((s) => s.gridZoomThreshold);
  const whiteBackground = useEditorStore((s) => s.whiteBackground);
  const isPanning = useEditorStore((s) => s.isPanning);
  const activeLayerId = useEditorStore((s) => s.activeLayerId);
  const setZoomPercent = useEditorStore((s) => s.setZoomPercent);
  const setActiveLayerId = useEditorStore((s) => s.setActiveLayerId);
  const setCanUndo = useEditorStore((s) => s.setCanUndo);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const editor = new Editor(canvas);
    editorRef.current = editor;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      editor.resize(rect.width, rect.height);
    }

    const unsub = editor.onChange(() => {
      setZoomPercent(editor.getZoomPercent());
      setCanUndo(editor.canUndo());
    });

    setZoomPercent(editor.getZoomPercent());
    setCanUndo(editor.canUndo());
    setActiveLayerId(editor.getActiveLayer().id);

    return () => {
      unsub();
      editor.destroy();
      editorRef.current = null;
    };
  }, [canvasRef, setZoomPercent, setActiveLayerId, setCanUndo]);

  useEffect(() => {
    editorRef.current?.setTool(activeTool);
  }, [activeTool]);

  useEffect(() => {
    editorRef.current?.setPrimaryColorIndex(primaryColorIndex);
  }, [primaryColorIndex]);

  useEffect(() => {
    editorRef.current?.setRenderOptions({ showGrid, gridZoomThreshold, whiteBackground });
  }, [showGrid, gridZoomThreshold, whiteBackground]);

  useEffect(() => {
    if (activeLayerId) {
      editorRef.current?.setActiveLayer(activeLayerId);
    }
  }, [activeLayerId]);

  useEffect(() => {
    editorRef.current?.setPanMode(isPanning);
  }, [isPanning]);

  useEffect(() => {
    const manager = createKeyboardManager();

    manager.register({ key: 'b', handler: () => useEditorStore.getState().setActiveTool('pencil') });
    manager.register({ key: 'e', handler: () => useEditorStore.getState().setActiveTool('eraser') });
    manager.register({ key: 'g', handler: () => useEditorStore.getState().setActiveTool('fill') });

    registerModShortcut(manager, 'z', false, () => editorRef.current?.undo());
    registerModShortcut(manager, 'z', true, () => editorRef.current?.redo());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        useEditorStore.getState().setIsPanning(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        useEditorStore.getState().setIsPanning(false);
      }
    };

    manager.attach();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      manager.detach();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const getEditor = useCallback(() => editorRef.current, []);

  const resize = useCallback(
    (width: number, height: number) => {
      editorRef.current?.resize(width, height);
      setZoomPercent(editorRef.current?.getZoomPercent() ?? 100);
    },
    [setZoomPercent],
  );

  return (
    <EditorContext.Provider value={{ getEditor, resize }}>{children}</EditorContext.Provider>
  );
}

export function useEditorContext(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditorContext must be used within EditorProvider');
  return ctx;
}
