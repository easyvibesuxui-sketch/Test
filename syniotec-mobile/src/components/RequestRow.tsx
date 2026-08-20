import type { ReactNode } from 'react';
import { StatusBadge, type RequestStatus } from './StatusBadge';
import { TrackerRow } from './Surfaces';

export type RequestItem = {
  kind: string;
  date: string;
  status: RequestStatus;
  by?: string;
  note?: string;
  icon: ReactNode;
  tone?: 'default' | 'rose' | 'plain';
};

/** One request line: glyph, kind + date, status chip, optional by/note. */
export function RequestRow({ item }: { item: RequestItem }) {
  return (
    <TrackerRow tone={item.tone}>
      <div className="flex w-full items-start justify-between">
        <div className="flex w-[181.5px] items-center gap-[8px]">
          <div className="flex size-[32px] shrink-0 items-center justify-center text-eerie-black">
            {item.icon}
          </div>
          <div className="flex flex-col gap-[4px] whitespace-nowrap">
            <p className="title-5 text-eerie-black">{item.kind}</p>
            <p className="body-xs text-silver-chalice">{item.date}</p>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {item.by && (
        <p className="body-xs text-silver-chalice">
          by <span className="text-eerie-black">{item.by}</span>
        </p>
      )}

      {item.note && (
        <div className="flex w-full flex-col gap-[4px]">
          <p className="title-5 text-eerie-black">Note</p>
          <p className="body-xs text-silver-chalice">{item.note}</p>
        </div>
      )}
    </TrackerRow>
  );
}
