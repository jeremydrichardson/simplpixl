import { useRef, useEffect } from 'react';
import { useEditorContext } from '../hooks/useEditor';
import styles from './CanvasEditor.module.css';

interface CanvasSurfaceProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function CanvasSurface({ canvasRef }: CanvasSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resize } = useEditorContext();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        resize(entry.contentRect.width, entry.contentRect.height);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [resize]);

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
