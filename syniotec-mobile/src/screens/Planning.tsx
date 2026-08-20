import { useState } from 'react';
import { AssignmentCard } from '../components/AssignmentCard';
import { Calendar, WeekStrip } from '../components/Calendar';
import { ChevronDown } from '../components/icons';
import { LabelBar } from '../components/LabelBar';
import { Sheet } from '../components/Surfaces';
import { TabSwitcher } from '../components/TabSwitcher';
import {
  ASSIGNMENTS,
  SELECTED_DAY,
  SEPTEMBER,
  SEPTEMBER_MARKS,
  STRIP_DAYS,
  YEAR,
} from '../data/fixtures';

/**
 * Figma nodes 2084:7975 and 2084:8148 — the planning timeline. The two
 * frames are the collapsed and expanded states of the same screen, so the
 * calendar toggles between the day strip and the full month.
 */
export function Planning() {
  const [expanded, setExpanded] = useState(false);
  const [day, setDay] = useState(SELECTED_DAY);

  return (
    <Sheet>
      <LabelBar
        title="Time Tracking"
        subtitle="Upcoming Transportations"
        action="timesheet"
      />
      <TabSwitcher />

      <div className="flex w-full flex-col items-center gap-[16px] rounded-t-sheet bg-white px-[24px] pt-[32px] pb-[48px]">
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

        <div className="flex w-full flex-col items-center gap-[8px] pt-[16px]">
          {ASSIGNMENTS.map((item) => (
            <AssignmentCard key={item.dateLabel} item={item} />
          ))}
        </div>
      </div>
    </Sheet>
  );
}
