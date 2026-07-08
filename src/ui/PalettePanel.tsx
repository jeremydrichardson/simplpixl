import { useEditorStore } from '../store/editorStore';
import { rgbaToCss } from '../utils/color';
import styles from './PalettePanel.module.css';

const SWATCH_COUNT = 16;

export function PalettePanel() {
  const primaryColorIndex = useEditorStore((s) => s.primaryColorIndex);
  const secondaryColorIndex = useEditorStore((s) => s.secondaryColorIndex);
  const setPrimaryColorIndex = useEditorStore((s) => s.setPrimaryColorIndex);
  const setSecondaryColorIndex = useEditorStore((s) => s.setSecondaryColorIndex);

  const swatches = Array.from({ length: SWATCH_COUNT }, (_, i) => i + 1);

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Palette</h3>
      <div className={styles.current}>
        <div
          className={styles.currentSwatch}
          style={{ background: getSwatchColor(primaryColorIndex) }}
          title={`Primary (#${primaryColorIndex})`}
        />
        <div
          className={styles.currentSwatch}
          style={{ background: getSwatchColor(secondaryColorIndex) }}
          title={`Secondary (#${secondaryColorIndex})`}
        />
      </div>
      <div className={styles.grid}>
        {swatches.map((index) => (
          <button
            key={index}
            type="button"
            className={`${styles.swatch} ${primaryColorIndex === index ? styles.selected : ''}`}
            style={{ background: getSwatchColor(index) }}
            title={`Color ${index}`}
            onClick={() => setPrimaryColorIndex(index)}
            onContextMenu={(e) => {
              e.preventDefault();
              setSecondaryColorIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function getSwatchColor(index: number): string {
  const colors = [
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 128, b: 0, a: 255 },
    { r: 255, g: 255, b: 0, a: 255 },
    { r: 0, g: 255, b: 0, a: 255 },
    { r: 0, g: 255, b: 255, a: 255 },
    { r: 0, g: 0, b: 255, a: 255 },
    { r: 128, g: 0, b: 255, a: 255 },
    { r: 255, g: 0, b: 255, a: 255 },
    { r: 128, g: 128, b: 128, a: 255 },
    { r: 192, g: 192, b: 192, a: 255 },
    { r: 128, g: 64, b: 0, a: 255 },
    { r: 64, g: 32, b: 0, a: 255 },
    { r: 255, g: 192, b: 203, a: 255 },
    { r: 0, g: 128, b: 0, a: 255 },
  ];
  const color = colors[index - 1] ?? { r: 0, g: 0, b: 0, a: 255 };
  return rgbaToCss(color.r, color.g, color.b, color.a);
}
