import { useRef, useEffect, useCallback } from 'react';
import { Document } from '../model/Document';
import { serializeDocument, documentToJson } from '../model/serialization';
import { saveProject } from '../db/db';
import { EditorProvider, useEditorContext } from '../hooks/useEditor';
import { useEditorStore } from '../store/editorStore';
import { CanvasSurface } from './CanvasSurface';
import { Toolbar } from './Toolbar';
import { PalettePanel } from './PalettePanel';
import { LayersPanel } from './LayersPanel';
import { ProjectBrowser } from './ProjectBrowser';
import styles from './App.module.css';

function EditorLayout({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getEditor } = useEditorContext();
  const showProjectBrowser = useEditorStore((s) => s.showProjectBrowser);
  const setShowProjectBrowser = useEditorStore((s) => s.setShowProjectBrowser);
  const setActiveLayerId = useEditorStore((s) => s.setActiveLayerId);

  useEffect(() => {
    const editor = getEditor();
    if (!editor) return;

    let timeout: ReturnType<typeof setTimeout>;
    const unsub = editor.onChange(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (editor.getIsDirty()) {
          const serialized = serializeDocument(editor.document);
          saveProject({
            id: editor.document.id,
            name: editor.document.name,
            updatedAt: Date.now(),
            document: serialized,
          }).then(() => editor.clearDirty());
        }
      }, 2000);
    });

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [getEditor]);

  const handleFitToView = useCallback(() => getEditor()?.fitToView(), [getEditor]);

  const handleExportPng = useCallback(async () => {
    const editor = getEditor();
    if (!editor) return;
    const blob = await editor.exportPNG();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editor.document.name}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getEditor]);

  const handleImportPng = useCallback(() => fileInputRef.current?.click(), []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) await getEditor()?.importPNG(file);
      e.target.value = '';
    },
    [getEditor],
  );

  const handleSaveProject = useCallback(async () => {
    const editor = getEditor();
    if (!editor) return;
    const serialized = serializeDocument(editor.document);
    await saveProject({
      id: editor.document.id,
      name: editor.document.name,
      updatedAt: Date.now(),
      document: serialized,
    });
    editor.clearDirty();

    const json = documentToJson(editor.document);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editor.document.name}.simplpixl`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getEditor]);

  const handleNewProject = useCallback(() => {
    const doc = Document.create(32, 32, 'Untitled');
    getEditor()?.replaceDocument(doc);
    setActiveLayerId(doc.getActiveLayer().id);
    setShowProjectBrowser(false);
  }, [getEditor, setActiveLayerId, setShowProjectBrowser]);

  const handleOpenDocument = useCallback(
    (doc: Document) => {
      getEditor()?.replaceDocument(doc);
      setActiveLayerId(doc.getActiveLayer().id);
    },
    [getEditor, setActiveLayerId],
  );

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.logo}>simplpixl</h1>
        <Toolbar
          onFitToView={handleFitToView}
          onExportPng={handleExportPng}
          onImportPng={handleImportPng}
          onSaveProject={handleSaveProject}
          onOpenProjects={() => setShowProjectBrowser(true)}
        />
      </header>
      <div className={styles.main}>
        <div className={styles.editorArea}>
          <CanvasSurface canvasRef={canvasRef} />
        </div>
        <aside className={styles.sidebar}>
          <PalettePanel />
          <LayersPanel />
        </aside>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
      {showProjectBrowser && (
        <ProjectBrowser
          onOpen={handleOpenDocument}
          onNew={handleNewProject}
          onClose={() => setShowProjectBrowser(false)}
        />
      )}
    </div>
  );
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <EditorProvider canvasRef={canvasRef}>
      <EditorLayout canvasRef={canvasRef} />
    </EditorProvider>
  );
}
