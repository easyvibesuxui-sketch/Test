import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LabelBar } from '../components/LabelBar';
import { TabSwitcher } from '../components/TabSwitcher';
import { CardSection, GreyRegion, Sheet } from '../components/Surfaces';
import { RequestRow } from '../components/RequestRow';
import { Calendar } from '../components/Calendar';
import {
  SEPTEMBER,
  SEPTEMBER_MARKS,
  SELECTED_DAY,
  SUMMARY_REQUESTS,
  YEAR,
} from '../data/fixtures';

type TrackingScreenProps = {
  /** Card artwork — the shift calendar, the clock, or the break mug. */
  art: ReactNode;
  headline: string;
  /** Grey line under the artwork ("At work", "In 9 min"). */
  statusLabel: string;
  /** The line below it ("4 H and 47m", "your shift starts"). */
  statusValue: string;
  /** Pale green wash on the start-of-day tracker. */
  tone?: 'green' | 'plain';
  actions: ReactNode;
  project?: string;
};

/**
 * Shared body of the three "Ongoing" states — the start-of-day, at-work and
 * on-break frames differ only in their tracker copy and actions. The tracker
 * is a bordered panel inside the card; the actions sit below it, still inside
 * the card, as they do in the Figma frames.
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
        <section className="flex w-full flex-col items-start gap-[8px]">
          <h2 className="title-3 w-full text-dark-sienna">Ongoing</h2>
          <div className="flex w-full flex-col items-center gap-[16px] rounded-tracker bg-snow px-[16px] py-[24px]">
            <div
              className={`flex w-full flex-col items-center gap-[24px] rounded-card border border-cultured pt-[12px] pb-[16px] ${
                tone === 'green' ? 'bg-[#eef4ec]' : 'bg-snow'
              }`}
            >
              <p className="title-4 w-full text-center text-eerie-black">
                {headline}
              </p>
              <div className="text-eerie-black">{art}</div>
              <div className="flex flex-col items-center gap-[2px]">
                <p className="body-xs text-center text-silver-chalice">
                  {statusLabel}
                </p>
                <p className="body-xs text-center text-eerie-black">
                  {statusValue}
                </p>
              </div>
            </div>

            <div className="flex w-full items-center gap-[12px]">{actions}</div>

            {project && (
              <div className="flex w-full flex-col gap-[4px]">
                <p className="body-xs text-silver-chalice">Current Project</p>
                <p className="title-5 text-eerie-black">{project}</p>
              </div>
            )}
          </div>
        </section>

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

/** The outline / filled action pair below the tracker. */
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
      className={`flex h-[56px] flex-1 items-center justify-center gap-[8px] rounded-[2px] font-body text-[16px] font-medium ${
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
