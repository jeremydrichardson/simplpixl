import { useEditorStore } from '../store/editorStore';
import { useEditorContext } from '../hooks/useEditor';
import { FileMenu } from './FileMenu';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  onFitToView: () => void;
  onExportPng: () => void;
  onImportPng: () => void;
  onSaveProject: () => void;
  onExportJson: () => void;
  onOpenProjects: () => void;
}

export function Toolbar({
  onFitToView,
  onExportPng,
  onImportPng,
  onSaveProject,
  onExportJson,
  onOpenProjects,
}: ToolbarProps) {
  const { getEditor } = useEditorContext();
  const zoomPercent = useEditorStore((s) => s.zoomPercent);
  const showGrid = useEditorStore((s) => s.showGrid);
  const setShowGrid = useEditorStore((s) => s.setShowGrid);
  const whiteBackground = useEditorStore((s) => s.whiteBackground);
  const setWhiteBackground = useEditorStore((s) => s.setWhiteBackground);

  const handleZoomIn = () => {
    getEditor()?.zoomIn();
  };

  const handleZoomOut = () => {
    getEditor()?.zoomOut();
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.group}>
        <button type="button" className={styles.button} onClick={onFitToView}>
          Fit
        </button>
        <button
          type="button"
          className={styles.zoomButton}
          onClick={handleZoomOut}
          disabled={zoomPercent <= 100}
          title="Zoom out"
          aria-label="Zoom out"
        >
          −
        </button>
        <span className={styles.zoom}>{zoomPercent}%</span>
        <button
          type="button"
          className={styles.zoomButton}
          onClick={handleZoomIn}
          disabled={zoomPercent >= 6400}
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>
        <label className={styles.checkbox}>
          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
          Grid
        </label>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={whiteBackground}
            onChange={(e) => setWhiteBackground(e.target.checked)}
          />
          White bg
        </label>
      </div>

      <FileMenu
        onOpenProjects={onOpenProjects}
        onSaveProject={onSaveProject}
        onImportPng={onImportPng}
        onExportPng={onExportPng}
        onExportJson={onExportJson}
      />
    </div>
  );
}
