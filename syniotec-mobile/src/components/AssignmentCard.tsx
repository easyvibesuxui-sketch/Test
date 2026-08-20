import type { Assignment } from '../data/fixtures';
import {
  GetDirectionButton,
  LocationBlock,
  StartEndBlock,
} from './DetailSheet';
import { StatusBadge } from './StatusBadge';

/**
 * One entry on the planning timeline: the dot-and-rail on the left, then the
 * date caption and the assignment card.
 */
export function AssignmentCard({ item }: { item: Assignment }) {
  return (
    <div className="flex w-full items-start gap-[16px]">
      <div className="flex shrink-0 flex-col items-center gap-[3px] self-stretch">
        <div className="flex size-[16px] items-center justify-center rounded-full border border-candy-apple">
          {item.current && (
            <span className="size-[10px] rounded-full bg-candy-apple" />
          )}
        </div>
        <div className="w-px flex-1 bg-cultured" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-[6px]">
        <p className="title-4">
          <span className="text-jet">{item.dateLabel}</span>{' '}
          <span
            className={item.current ? 'text-candy-apple' : 'text-silver-chalice'}
          >
            {item.timeLabel}
          </span>
        </p>

        <div className="flex w-full min-w-0 flex-col items-start gap-[16px] rounded-tracker border border-cultured bg-white pt-[10px] pr-[16px] pb-[26px] pl-[12px]">
          <div className="flex w-full items-center gap-[16px]">
            <div className="flex flex-1 flex-col items-start gap-[8px]">
              <p className="body-s w-full text-silver-chalice">Project</p>
              <p className="title-5 text-eerie-black">{item.project}</p>
            </div>
            {item.status && <StatusBadge status={item.status} />}
          </div>

          <div className="flex w-full flex-col items-start gap-[16px]">
            <StartEndBlock start={item.start} end={item.end} />
            <LocationBlock city={item.city} address={item.address} />
          </div>

          <GetDirectionButton />
        </div>
      </div>
    </div>
  );
}
