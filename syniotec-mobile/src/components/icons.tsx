/**
 * Icon set for the Syniotec time-tracking screens.
 *
 * The Figma nodes reference their icons as remote SVG assets on
 * figma.com, which this environment's network policy cannot reach, so each
 * glyph below is redrawn to match the shape and 24px grid used in the file.
 * All of them inherit `currentColor` so screens can tint them with tokens.
 */
type IconProps = { className?: string; size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
});

export function ChevronLeft({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path
        d="M15 5 8 12l7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRight({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path
        d="m9 5 7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDown({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path
        d="m6 9.5 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarIcon({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3 10h18M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UserIcon({ className, size = 28 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.75" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.5 20c.9-3.7 3.9-5.6 7.5-5.6s6.6 1.9 7.5 5.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlayIcon({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <rect x="9.2" y="8.4" width="2" height="7.2" rx="0.8" fill="currentColor" />
      <rect x="12.8" y="8.4" width="2" height="7.2" rx="0.8" fill="currentColor" />
    </svg>
  );
}

export function StopIcon({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <rect
        x="8.8"
        y="8.8"
        width="6.4"
        height="6.4"
        rx="1.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function PlusIcon({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowRight({ className, size = 20 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path
        d="M4 12h15m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PinIcon({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path
        d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
