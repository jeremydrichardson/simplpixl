interface ToolIconProps {
  className?: string;
}

export function PencilIcon({ className }: ToolIconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11.5 1.5L14.5 4.5L5.5 13.5H2.5V10.5L11.5 1.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M9.5 3.5L12.5 6.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function EraserIcon({ className }: ToolIconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 11.5L8.5 6L12 9.5L6.5 15H3V11.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 6L11 3.5L13.5 6L11 8.5L8.5 6Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M2 15H14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function FillIcon({ className }: ToolIconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 12.5C3.5 11.5 4 10.5 5.5 9L9 5.5C10 4.5 11.5 4.5 12.5 5.5C13.5 6.5 13.5 8 12.5 9L9 12.5C7.5 14 6.5 14.5 5.5 14.5C4.5 14.5 3.5 13.5 3.5 12.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8 5.5L10.5 3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M2.5 14.5H6.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path d="M2 14.5H2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function UndoIcon({ className }: ToolIconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 5.5H10.5C12.5 5.5 14 7 14 9C14 11 12.5 12.5 10.5 12.5H9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 3L3 5.5L5.5 8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
