import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from './icons';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
  'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
];

/** Per-day marker under the date, matching the Figma "Indicator" dot. */
export type DayMark = 'none' | 'worked' | 'pending' | 'planned';

const MARK_COLOR: Record<DayMark, string> = {
  none: 'bg-transparent',
  worked: 'bg-mantis',
  pending: 'bg-xanthous',
  planned: 'bg-dodger-blue',
};

export type CalendarDay = {
  day: number;
  weekday: number;
  mark?: DayMark;
  /** Days spilling over from the neighbouring month read as muted. */
  muted?: boolean;
};

/**
 * The Figma calendar is a continuous run of days laid out nine to a row
 * rather than a Mon–Sun grid, so days are generated as a flat sequence and
 * chunked by nine.
 */
export function buildDayRun(
  year: number,
  month: number,
  marks: Record<number, DayMark> = {},
): CalendarDay[] {
  const length = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  return Array.from({ length }, (_, i) => ({
    day: i + 1,
    weekday: (firstWeekday + i) % 7,
    mark: marks[i + 1] ?? 'none',
  }));
}

function chunk<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size),
  );
}

function DateCell({
  entry,
  selected,
  onSelect,
}: {
  entry: CalendarDay;
  selected: boolean;
  onSelect?: (day: number) => void;
}) {
  const tone = selected
    ? 'bg-candy-apple text-smoke'
    : entry.muted
      ? 'text-silver-chalice'
      : 'text-eerie-black';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(entry.day)}
      aria-current={selected ? 'date' : undefined}
      className={`flex flex-1 flex-col items-center justify-center gap-[4px] rounded-card px-[4px] py-[6px] ${tone}`}
    >
      <span className="body-xs">{DAY_LABELS[entry.weekday]}</span>
      <span className="body-xs">{entry.day}</span>
      <span
        className={`size-[4px] rounded-[2px] ${
          selected ? 'bg-smoke' : MARK_COLOR[entry.mark ?? 'none']
        }`}
      />
    </button>
  );
}

/** The single-row strip of days shown when the calendar is collapsed. */
export function WeekStrip({
  days,
  selected,
  onSelect,
  className = '',
}: {
  days: CalendarDay[];
  selected: number;
  onSelect?: (day: number) => void;
  className?: string;
}) {
  return (
    <div className={`flex w-full items-start justify-center ${className}`}>
      {days.map((entry) => (
        <DateCell
          key={entry.day}
          entry={entry}
          selected={entry.day === selected}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

type CalendarProps = {
  year?: number;
  /** Zero-based, matching `Date`. */
  month?: number;
  marks?: Record<number, DayMark>;
  selected?: number;
  onSelect?: (day: number) => void;
  /** Renders the chevron that collapses the calendar back to a strip. */
  onCollapse?: () => void;
  className?: string;
};

/**
 * The expanded month calendar: a month/year header with paging arrows over
 * rows of nine days.
 */
export function Calendar({
  year: initialYear = 2025,
  month: initialMonth = 8,
  marks = {},
  selected = 21,
  onSelect,
  onCollapse,
  className = '',
}: CalendarProps) {
  const [[year, month], setMonth] = useState<[number, number]>([
    initialYear,
    initialMonth,
  ]);
  const [active, setActive] = useState(selected);
  const rows = useMemo(
    () => chunk(buildDayRun(year, month, marks), 9),
    [year, month, marks],
  );

  const step = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    setMonth([next.getFullYear(), next.getMonth()]);
  };

  const select = (day: number) => {
    setActive(day);
    onSelect?.(day);
  };

  return (
    <div
      className={`flex w-full flex-col items-center gap-[12px] rounded-card bg-smoke px-[12px] pt-[8px] pb-[24px] drop-shadow-[0_4px_2px_rgba(21,21,21,0.08)] ${className}`}
    >
      <div className="flex w-full items-center justify-center">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => step(-1)}
          className="flex size-[40px] items-center justify-center text-eerie-black"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex flex-1 items-center justify-center gap-[8px]">
          <p className="title-4 text-center text-eerie-black">
            {MONTHS[month]} {year}
          </p>
          {onCollapse && (
            <button
              type="button"
              aria-label="Collapse calendar"
              onClick={onCollapse}
              className="text-eerie-black"
            >
              <ChevronDown size={16} />
            </button>
          )}
        </div>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => step(1)}
          className="flex size-[40px] items-center justify-center text-eerie-black"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex w-full flex-col gap-[4px]">
        {rows.map((row, i) => (
          <div key={i} className="flex w-full items-start justify-center">
            {row.map((entry) => (
              <DateCell
                key={entry.day}
                entry={entry}
                selected={entry.day === active}
                onSelect={select}
              />
            ))}
            {/* Keep the last, short row aligned with the ones above it. */}
            {Array.from({ length: 9 - row.length }, (_, k) => (
              <div key={`pad-${k}`} className="flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
