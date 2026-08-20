import { useState } from 'react';
import { Calendar, WeekStrip } from '../components/Calendar';
import { ChevronDown } from '../components/icons';
import { Sheet } from '../components/Surfaces';
import {
  SELECTED_DAY,
  SEPTEMBER,
  SEPTEMBER_MARKS,
  STRIP_DAYS,
  TIMESHEET_DAYS,
  YEAR,
  type TimesheetDay,
} from '../data/fixtures';

function EntryRow({
  kind,
  duration,
  start,
  end,
}: TimesheetDay['entries'][number]) {
  return (
    <div className="flex w-full flex-col gap-[8px] rounded-card bg-smoke px-[12px] py-[8px]">
      <div className="flex w-full items-center justify-between">
        <p className="title-5 text-eerie-black">{kind}</p>
        <p className="title-5 text-eerie-black">{duration}</p>
      </div>
      <div className="flex items-center gap-[12px]">
        <p className="caption-2 text-silver-chalice">Start</p>
        <p className="caption-2 text-eerie-black">{start}</p>
      </div>
      <div className="flex items-center gap-[12px]">
        <p className="caption-2 text-silver-chalice">End</p>
        <p className="caption-2 text-eerie-black">{end}</p>
      </div>
    </div>
  );
}

function DayBlock({ day }: { day: TimesheetDay }) {
  return (
    <section className="flex w-full flex-col gap-[8px]">
      <p className="title-4 text-jet">{day.dateLabel}</p>
      <div className="flex w-full flex-col gap-[12px] rounded-tracker border border-cultured bg-white p-[12px]">
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col gap-[4px]">
            <p className="body-s text-silver-chalice">Project</p>
            <p className="title-5 text-eerie-black">{day.project}</p>
          </div>
          <div className="flex flex-col items-end gap-[4px]">
            <p className="body-s text-silver-chalice">Total Working Time</p>
            <p className="title-5 text-eerie-black">{day.total}</p>
          </div>
        </div>
        {day.entries.map((entry, i) => (
          <EntryRow key={i} {...entry} />
        ))}
      </div>
    </section>
  );
}

/**
 * Figma nodes 2084:9037 and 2084:9280 — the timesheet. `defaultExpanded`
 * selects between the week-strip frame and the month-calendar frame.
 */
export function Timesheet({
  defaultExpanded = false,
}: {
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [day, setDay] = useState(SELECTED_DAY);

  return (
    <Sheet>
      <div className="flex w-full flex-col items-center gap-[16px] px-[24px] pt-[40px] pb-[48px]">
        <p className="title-3 w-full text-dark-sienna">Timesheet</p>

        {expanded ? (
          <Calendar
            year={YEAR}
            month={SEPTEMBER}
            marks={SEPTEMBER_MARKS}
            selected={day}
            onSelect={setDay}
            onCollapse={() => setExpanded(false)}
          />
        ) : (
          <div className="flex w-full flex-col items-center">
            <WeekStrip days={STRIP_DAYS} selected={day} onSelect={setDay} />
            <button
              type="button"
              aria-label="Expand calendar"
              onClick={() => setExpanded(true)}
              className="text-silver-chalice"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        )}

        <div className="flex w-full flex-col gap-[16px]">
          {TIMESHEET_DAYS.map((entry) => (
            <DayBlock key={entry.dateLabel} day={entry} />
          ))}
        </div>
      </div>
    </Sheet>
  );
}

/** The month-expanded variant, routed separately so both frames are linkable. */
export function TimesheetMonth() {
  return <Timesheet defaultExpanded />;
}
