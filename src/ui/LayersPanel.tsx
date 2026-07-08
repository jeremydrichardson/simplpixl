import { useEffect, useState, useCallback } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useEditorContext } from '../hooks/useEditor';
import styles from './LayersPanel.module.css';

export function LayersPanel() {
  const { getEditor } = useEditorContext();
  const activeLayerId = useEditorStore((s) => s.activeLayerId);
  const setActiveLayerId = useEditorStore((s) => s.setActiveLayerId);
  const [, setRevision] = useState(0);
  const bump = useCallback(() => setRevision((r) => r + 1), []);

  useEffect(() => {
    const editor = getEditor();
    if (!editor) return;
    return editor.onChange(bump);
  }, [getEditor, bump]);

  const editor = getEditor();
  const layers =
    editor?.document.getActiveFrame().layers.map((l) => ({
      id: l.id,
      name: l.name,
      visible: l.visible,
      opacity: l.opacity,
    })) ?? [];

  const handleAdd = () => {
    const ed = getEditor();
    if (!ed) return;
    const layer = ed.addLayer();
    setActiveLayerId(layer.id);
    bump();
  };

  const handleRemove = (id: string) => {
    getEditor()?.removeLayer(id);
    bump();
  };

  const handleMoveUp = (id: string) => {
    const ed = getEditor();
    if (!ed) return;
    const index = ed.document.getActiveFrame().layers.findIndex((l) => l.id === id);
    if (index < ed.document.getActiveFrame().layers.length - 1) {
      ed.moveLayer(id, index + 1);
      bump();
    }
  };

  const handleMoveDown = (id: string) => {
    const ed = getEditor();
    if (!ed) return;
    const index = ed.document.getActiveFrame().layers.findIndex((l) => l.id === id);
    if (index > 0) {
      ed.moveLayer(id, index - 1);
      bump();
    }
  };

  const handleClear = () => {
    getEditor()?.clearLayer();
    bump();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Layers</h3>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            title="Clear selected layer"
          >
            ⌫
          </button>
          <button type="button" className={styles.addButton} onClick={handleAdd}>
            +
          </button>
        </div>
      </div>
      <ul className={styles.list}>
        {[...layers].reverse().map((layer) => (
          <li
            key={layer.id}
            className={`${styles.item} ${activeLayerId === layer.id ? styles.active : ''}`}
          >
            <button
              type="button"
              className={styles.visibility}
              onClick={() => {
                getEditor()?.setLayerVisibility(layer.id, !layer.visible);
                bump();
              }}
            >
              {layer.visible ? '👁' : '—'}
            </button>
            <button
              type="button"
              className={styles.name}
              onClick={() => setActiveLayerId(layer.id)}
            >
              {layer.name}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(layer.opacity * 100)}
              className={styles.opacity}
              onChange={(e) => {
                getEditor()?.setLayerOpacity(layer.id, Number(e.target.value) / 100);
              }}
            />
            <button type="button" className={styles.move} onClick={() => handleMoveUp(layer.id)}>
              ↑
            </button>
            <button type="button" className={styles.move} onClick={() => handleMoveDown(layer.id)}>
              ↓
            </button>
            <button type="button" className={styles.remove} onClick={() => handleRemove(layer.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
