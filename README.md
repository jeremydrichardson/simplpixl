# simplpixl

A lightweight pixel art editor built as a Progressive Web App.

## Architecture

```
UI (React) → Editor API → Document Model → Renderer
```

- **UI** — React components for toolbar, palette, layers, and project browser
- **Editor** — Framework-agnostic engine handling tools, input, history, and I/O
- **Model** — Document, layers, frames, and palette-indexed pixel buffers
- **Renderer** — Canvas 2D rendering (checkerboard, pixels, grid)

Pixel data lives in the document model, never in Zustand. The canvas is render-only.

## Getting Started

This project uses [pnpm](https://pnpm.io/) v10. Enable it via Corepack:

```bash
corepack enable
pnpm install
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Type-check and build for production |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Run Vitest unit tests |

## Tools

- **Pencil** (B) — Draw pixels
- **Eraser** (E) — Erase to transparent
- **Fill** (G) — Flood fill

## Shortcuts

| Shortcut | Action |
|----------|--------|
| B | Pencil |
| E | Eraser |
| G | Fill |
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Shift + Z | Redo |
| Space (hold) | Pan |
| Scroll wheel | Zoom |

## Project Format

Projects are saved locally via IndexedDB (autosave) and can be exported as `.simplpixl` JSON files or PNG images.
