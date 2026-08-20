import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LabelBar } from '../components/LabelBar';
import { TabSwitcher } from '../components/TabSwitcher';
import { CardSection, GreyRegion, Sheet } from '../components/Surfaces';
import { RequestRow } from '../components/RequestRow';
import { Calendar } from '../components/Calendar';
import { ButtonLarge } from '../components/Buttons';
import {
  SEPTEMBER,
  SEPTEMBER_MARKS,
  SELECTED_DAY,
  SUMMARY_REQUESTS,
  YEAR,
} from '../data/fixtures';

type TrackingScreenProps = {
  /** Card artwork — the alarm clock, or the break mug. */
  art: ReactNode;
  headline: string;
  /** Small grey line under the headline ("At work", "In 9 min"). */
  statusLabel: string;
  /** The large value beside it ("4 H and 47m", "your shift starts"). */
  statusValue: string;
  /** Pale wash behind the ongoing card. */
  tone?: 'green' | 'plain';
  actions: ReactNode;
  project?: string;
};

/**
 * Shared body of the three "Ongoing" states — the start-of-day, at-work and
 * on-break frames only differ by their card copy and actions.
 */
export function TrackingScreen({
  art,
  headline,
  statusLabel,
  statusValue,
  tone = 'plain',
  actions,
  project,
}: TrackingScreenProps) {
  return (
    <Sheet>
      <LabelBar
        title="Time Tracking"
        subtitle="Upcoming Transportations"
        action="timesheet"
      />
      <TabSwitcher />
      <GreyRegion>
        <CardSection title="Ongoing">
          <div
            className={`flex w-full flex-col items-center gap-[16px] rounded-tracker p-[16px] ${
              tone === 'green' ? 'bg-[#e6f2e2]' : 'bg-tracker/64'
            }`}
          >
            <p className="title-3 w-full text-eerie-black">{headline}</p>
            <div className="text-eerie-black">{art}</div>
            <p className="body-xs text-center text-silver-chalice">
              {statusLabel}
            </p>
            <p className="title-3 text-center text-eerie-black">{statusValue}</p>
            <div className="flex w-full items-center gap-[12px]">{actions}</div>
          </div>

          {project && (
            <div className="flex w-full flex-col gap-[4px] pt-[4px]">
              <p className="title-5 text-silver-chalice">Current Project</p>
              <p className="title-5 text-eerie-black">{project}</p>
            </div>
          )}
        </CardSection>

        <CardSection title="Your Requests">
          {SUMMARY_REQUESTS.map((item, i) => (
            <RequestRow key={i} item={item} />
          ))}
        </CardSection>

        <section className="flex w-full flex-col items-start gap-[8px]">
          <h2 className="title-3 w-full text-dark-sienna">Calendar</h2>
          <Calendar
            year={YEAR}
            month={SEPTEMBER}
            marks={SEPTEMBER_MARKS}
            selected={SELECTED_DAY}
          />
        </section>
      </GreyRegion>
    </Sheet>
  );
}

/** Outline / filled pair used by the working and break states. */
export function TrackingAction({
  label,
  to,
  variant,
  icon,
}: {
  label: string;
  to: string;
  variant: 'outline' | 'dark';
  icon: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`flex h-[44px] flex-1 items-center justify-center gap-[8px] rounded-card font-body text-[14px] font-medium ${
        variant === 'dark'
          ? 'bg-eerie-black text-white'
          : 'border border-eerie-black bg-white text-eerie-black'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export { ButtonLarge };
