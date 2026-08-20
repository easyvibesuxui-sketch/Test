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

/**
 * Artwork on the "Good morning" card (Figma node 2084:7387): a desk calendar
 * with a briefcase in a magnifier over it.
 */
export function ShiftCalendar({ className, size = 96 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M18 36h62l-5 52H8l10-52Z" />
        <path d="M80 36v52" />
        <path d="M62 82c5-5 10-4 14 6" />
        <circle cx="30" cy="55" r="5" />
        <circle cx="48" cy="55" r="5" />
        <circle cx="66" cy="55" r="5" />
        <circle cx="27" cy="72" r="5" />
        <circle cx="45" cy="72" r="5" />
        <circle cx="63" cy="72" r="5" />
        <circle cx="37" cy="27" r="21" fill="#ffffff" />
        <path d="M52 42 62 52" />
        <rect x="26" y="22" width="23" height="15" rx="2.5" fill="#ffffff" />
        <path d="M34 22v-3.5a2.5 2.5 0 0 1 2.5-2.5h2a2.5 2.5 0 0 1 2.5 2.5V22" />
        <path d="M26 28h23" />
      </g>
    </svg>
  );
}

/**
 * Artwork on the at-work card (Figma node 2084:8481): a clock face with the
 * 24-hour badge tucked into its lower right.
 */
export function ClockTwentyFour({ className, size = 96 }: IconProps) {
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <circle cx="44" cy="46" r="34" />
        {ticks.map((angle) => (
          <line
            key={angle}
            x1="44"
            y1="18"
            x2="44"
            y2="24"
            transform={`rotate(${angle} 44 46)`}
          />
        ))}
        <path d="M44 26v20l14 8" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="72" cy="72" r="15" fill="#ffffff" />
      </g>
      <text
        x="72"
        y="78"
        textAnchor="middle"
        fontFamily="var(--font-title)"
        fontSize="15"
        fontWeight="500"
        fill="currentColor"
      >
        24
      </text>
    </svg>
  );
}

/** Artwork on the break card (Figma node 2084:8727): a cup on a saucer. */
export function CoffeeCup({ className, size = 96 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 42h48v14a24 24 0 0 1-24 24 24 24 0 0 1-24-24V42Z" />
        <path d="M62 46c8 1 12 5 12 10s-5 9-12 10" />
        <path d="M18 80c6 3 16 4 28 4s22-1 28-4" />
        <path d="M38 34c-4-5 2-8-1-13M48 32c-4-5 2-8-1-13M58 34c-3-4 1-7-1-11" />
      </g>
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

/* --- Request-reason glyphs (New Request screen) --- */

export function SickIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-7.5-9.8A4.2 4.2 0 0 1 12 8.2a4.2 4.2 0 0 1 7.5 2.5c0 5.2-7.5 9.8-7.5 9.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 11v4M10 13h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VacationIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path
        d="M12 3c4.5 0 8.5 3 9.5 6.5C18 8 15 8.3 12 10c-3-1.7-6-2-9.5-.5C3.5 6 7.5 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 10v11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 21c1.3-1.2 2.7-1.2 4 0 1.3 1.2 2.7 1.2 4 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SchoolIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path
        d="m12 4 9 4.5-9 4.5-9-4.5L12 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.5V16c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TrainingIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path
        d="M4 5.5h6a2.5 2.5 0 0 1 2 2.5v11a2 2 0 0 0-2-1.5H4v-12ZM20 5.5h-6a2.5 2.5 0 0 0-2 2.5v11a2 2 0 0 1 2-1.5h6v-12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ParentalLeaveIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <circle cx="9" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.5 20c0-3.6 2-5.8 4.5-5.8s4.5 2.2 4.5 5.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="17" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M14.5 20c0-2.4 1.1-3.9 2.5-3.9s2.5 1.5 2.5 3.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InfoIcon({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 11v5.5M12 7.8v.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
