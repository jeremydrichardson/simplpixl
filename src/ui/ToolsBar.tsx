import {
  PiArrowCounterClockwise,
  PiEraser,
  PiPaintBucket,
  PiPencilLineBold,
  PiTrash,
} from 'react-icons/pi';
import type { IconType } from 'react-icons';
import { useEditorStore } from '../store/editorStore';
import { useEditorContext } from '../hooks/useEditor';
import type { ToolId } from '../editor/Editor';
import styles from './ToolsBar.module.css';

const TOOLS: { id: ToolId; label: string; shortcut: string; Icon: IconType }[] = [
  { id: 'pencil', label: 'Pencil', shortcut: 'B', Icon: PiPencilLineBold },
  { id: 'eraser', label: 'Eraser', shortcut: 'E', Icon: PiEraser },
  { id: 'fill', label: 'Fill', shortcut: 'G', Icon: PiPaintBucket },
];

export function ToolsBar() {
  const { getEditor } = useEditorContext();
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const canUndo = useEditorStore((s) => s.canUndo);

  const handleUndo = () => {
    getEditor()?.undo();
  };

  const handleClear = () => {
    getEditor()?.clearLayer();
  };

  return (
    <aside className={styles.toolsBar} aria-label="Tools">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          type="button"
          className={`${styles.toolButton} ${activeTool === tool.id ? styles.active : ''}`}
          onClick={() => setActiveTool(tool.id)}
          title={`${tool.label} (${tool.shortcut})`}
          aria-label={`${tool.label} (${tool.shortcut})`}
        >
          <tool.Icon className={styles.toolIcon} size={18} />
        </button>
      ))}
      <div className={styles.separator} />
      <button
        type="button"
        className={styles.toolButton}
        onClick={handleUndo}
        disabled={!canUndo}
        title="Undo (Ctrl/Cmd+Z)"
        aria-label="Undo (Ctrl/Cmd+Z)"
      >
        <PiArrowCounterClockwise className={styles.toolIcon} size={18} />
      </button>
      <button
        type="button"
        className={styles.toolButton}
        onClick={handleClear}
        title="Clear active layer"
        aria-label="Clear active layer"
      >
        <PiTrash className={styles.toolIcon} size={18} />
      </button>
    </aside>
  );
}
