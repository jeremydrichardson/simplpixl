import { useEditorStore } from '../store/editorStore';
import { useEditorContext } from '../hooks/useEditor';
import type { ToolId } from '../editor/Editor';
import { EraserIcon, FillIcon, PencilIcon, UndoIcon } from './ToolIcons';
import styles from './Toolbar.module.css';

const TOOLS: { id: ToolId; label: string; shortcut: string; Icon: typeof PencilIcon }[] = [
  { id: 'pencil', label: 'Pencil', shortcut: 'B', Icon: PencilIcon },
  { id: 'eraser', label: 'Eraser', shortcut: 'E', Icon: EraserIcon },
  { id: 'fill', label: 'Fill', shortcut: 'G', Icon: FillIcon },
];

interface ToolbarProps {
  onFitToView: () => void;
  onExportPng: () => void;
  onImportPng: () => void;
  onSaveProject: () => void;
  onOpenProjects: () => void;
}

export function Toolbar({
  onFitToView,
  onExportPng,
  onImportPng,
  onSaveProject,
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
            <tool.Icon className={styles.toolIcon} />
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
          <UndoIcon className={styles.toolIcon} />
        </button>
      </div>

      <div className={styles.group}>
        <button type="button" className={styles.button} onClick={onFitToView}>
          Fit
        </button>
        <span className={styles.zoom}>{zoomPercent}%</span>
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
      </div>
    </div>
  );
}
