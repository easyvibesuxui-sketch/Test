import cupUrl from '../assets/icons/art-cup.svg';
import clockUrl from '../assets/icons/art-clock-24.svg';
import shiftCalendarUrl from '../assets/icons/art-shift-calendar.svg';
import rowSickUrl from '../assets/icons/row-sick.svg';
import rowVacationUrl from '../assets/icons/row-vacation.svg';
import reasonSchoolUrl from '../assets/icons/reason-school.svg';
import reasonTrainingUrl from '../assets/icons/reason-training.svg';
import reasonParentalUrl from '../assets/icons/reason-parental.svg';
import reasonOtherUrl from '../assets/icons/reason-other.svg';

/*
 * Illustrations exported from Figma through the Plugin API rather than
 * redrawn: the `use_figma` tool returns `exportAsync({ format: 'SVG_STRING' })`
 * output as text, so the original vectors come across intact even though the
 * figma.com asset URLs are unreachable from this environment.
 */

type ArtProps = { size?: number; className?: string };

/** Node 2084:7387 — desk calendar with a briefcase in a magnifier. */
export function ShiftCalendarArt({ size = 96, className = '' }: ArtProps) {
  return (
    <img src={shiftCalendarUrl} alt="" width={size} height={size} className={className} />
  );
}

/** Node 2084:8481 — clock face with the 24-hour badge. */
export function ClockArt({ size = 96, className = '' }: ArtProps) {
  return <img src={clockUrl} alt="" width={size} height={size} className={className} />;
}

/** Node 2084:8730 — the cup on a saucer used by the break state. */
export function CupArt({ size = 96, className = '' }: ArtProps) {
  return <img src={cupUrl} alt="" width={size} height={size} className={className} />;
}

/** Node 2084:7840 — the parasol glyph on vacation request rows. */
export function VacationGlyph({ size = 32, className = '' }: ArtProps) {
  return <img src={rowVacationUrl} alt="" width={size} height={size} className={className} />;
}

/** Node 2084:7853 — the cross glyph on sick-day request rows. */
export function SickGlyph({ size = 32, className = '' }: ArtProps) {
  return <img src={rowSickUrl} alt="" width={size} height={size} className={className} />;
}

/**
 * Reason glyphs on the New Request form (nodes 2084:7753 / 7760 / 7767 /
 * 7775 / 7783 / 7792). Sick and Vacation share their artwork with the
 * request rows above.
 */
export const REASON_GLYPHS: Record<string, string> = {
  Sick: rowSickUrl,
  Vacation: rowVacationUrl,
  School: reasonSchoolUrl,
  Training: reasonTrainingUrl,
  'Parental Leave': reasonParentalUrl,
  Other: reasonOtherUrl,
};

export function ReasonGlyph({
  reason,
  size = 32,
  className = '',
}: ArtProps & { reason: keyof typeof REASON_GLYPHS }) {
  return (
    <img
      src={REASON_GLYPHS[reason]}
      alt=""
      width={size}
      height={size}
      className={className}
    />
  );
}
