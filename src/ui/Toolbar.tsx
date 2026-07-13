import {
  PiArrowCounterClockwise,
  PiEraser,
  PiPaintBucket,
  PiPencilLineBold,
} from 'react-icons/pi';
import type { IconType } from 'react-icons';
import { useEditorStore } from '../store/editorStore';
import { useEditorContext } from '../hooks/useEditor';
import type { ToolId } from '../editor/Editor';
import styles from './Toolbar.module.css';

const TOOLS: { id: ToolId; label: string; shortcut: string; Icon: IconType }[] = [
  { id: 'pencil', label: 'Pencil', shortcut: 'B', Icon: PiPencilLineBold },
  { id: 'eraser', label: 'Eraser', shortcut: 'E', Icon: PiEraser },
  { id: 'fill', label: 'Fill', shortcut: 'G', Icon: PiPaintBucket },
];

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
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const zoomPercent = useEditorStore((s) => s.zoomPercent);
  const showGrid = useEditorStore((s) => s.showGrid);
  const setShowGrid = useEditorStore((s) => s.setShowGrid);
  const whiteBackground = useEditorStore((s) => s.whiteBackground);
  const setWhiteBackground = useEditorStore((s) => s.setWhiteBackground);
  const canUndo = useEditorStore((s) => s.canUndo);

  const handleUndo = () => {
    getEditor()?.undo();
  };

  const handleZoomIn = () => {
    getEditor()?.zoomIn();
  };

  const handleZoomOut = () => {
    getEditor()?.zoomOut();
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.group}>
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={`${styles.toolButton} ${activeTool === tool.id ? styles.active : ''}`}
            onClick={() => setActiveTool(tool.id)}
            title={`${tool.label} (${tool.shortcut})`}
            aria-label={`${tool.label} (${tool.shortcut})`}
          >
            <tool.Icon className={styles.toolIcon} size={16} />
          </button>
        ))}
        <button
          type="button"
          className={styles.toolButton}
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo (Ctrl/Cmd+Z)"
          aria-label="Undo (Ctrl/Cmd+Z)"
        >
          <PiArrowCounterClockwise className={styles.toolIcon} size={16} />
        </button>
      </div>

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

      <div className={styles.group}>
        <button type="button" className={styles.button} onClick={onOpenProjects}>
          Projects
        </button>
        <button type="button" className={styles.button} onClick={onSaveProject}>
          Save
        </button>
        <button type="button" className={styles.button} onClick={onImportPng}>
          Import PNG
        </button>
        <button type="button" className={styles.button} onClick={onExportPng}>
          Export PNG
        </button>
        <button type="button" className={styles.button} onClick={onExportJson}>
          Export JSON
        </button>
      </div>
    </div>
  );
}
