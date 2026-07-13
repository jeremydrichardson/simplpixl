import { useEffect, useId, useRef, useState } from 'react';
import { PiFolder } from 'react-icons/pi';
import styles from './FileMenu.module.css';

interface FileMenuProps {
  onExportPng: () => void;
  onImportPng: () => void;
  onSaveProject: () => void;
  onExportJson: () => void;
  onOpenProjects: () => void;
}

export function FileMenu({
  onExportPng,
  onImportPng,
  onSaveProject,
  onExportJson,
  onOpenProjects,
}: FileMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        title="File"
        aria-label="File menu"
      >
        <PiFolder size={18} />
      </button>
      {open && (
        <div className={styles.popover} id={menuId} role="menu">
          <button type="button" className={styles.item} role="menuitem" onClick={() => run(onOpenProjects)}>
            Projects
          </button>
          <button type="button" className={styles.item} role="menuitem" onClick={() => run(onSaveProject)}>
            Save
          </button>
          <div className={styles.separator} />
          <button type="button" className={styles.item} role="menuitem" onClick={() => run(onImportPng)}>
            Import PNG
          </button>
          <button type="button" className={styles.item} role="menuitem" onClick={() => run(onExportPng)}>
            Export PNG
          </button>
          <button type="button" className={styles.item} role="menuitem" onClick={() => run(onExportJson)}>
            Export JSON
          </button>
        </div>
      )}
    </div>
  );
}
