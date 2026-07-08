export type ShortcutHandler = (event: KeyboardEvent) => void;

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  handler: ShortcutHandler;
}

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || (el as HTMLElement).isContentEditable;
}

export function createKeyboardManager() {
  const shortcuts: Shortcut[] = [];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isInputFocused()) return;

    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl
        ? event.metaKey || event.ctrlKey
        : !event.metaKey && !event.ctrlKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

      if (keyMatch && ctrlMatch && shiftMatch) {
        event.preventDefault();
        shortcut.handler(event);
        return;
      }
    }
  };

  return {
    register(shortcut: Shortcut) {
      shortcuts.push(shortcut);
    },
    attach() {
      window.addEventListener('keydown', handleKeyDown);
    },
    detach() {
      window.removeEventListener('keydown', handleKeyDown);
    },
  };
}

export function registerModShortcut(
  manager: ReturnType<typeof createKeyboardManager>,
  key: string,
  shift: boolean,
  handler: ShortcutHandler,
) {
  manager.register({
    key,
    ctrl: true,
    shift,
    handler,
  });
}
