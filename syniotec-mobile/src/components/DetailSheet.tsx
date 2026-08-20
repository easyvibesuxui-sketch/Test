import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, PinIcon } from './icons';
import { FieldLabel } from './Surfaces';

/**
 * The detail layout used by the job and request-review frames: a grey panel
 * with an 8px white keyline, a back control and progress bar, then the body.
 */
export function DetailSheet({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="flex w-full flex-col gap-[12px] rounded-t-sheet border-8 border-white bg-cultured px-[16px] py-[8px]">
        <div className="flex w-full items-center overflow-hidden py-[6px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex size-[36px] items-center justify-center rounded-[2px] px-[8px] text-eerie-black"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex flex-1 items-center justify-center pr-[14px]">
            <div className="h-[6px] w-[110px] overflow-hidden rounded-[3px] bg-white">
              <div className="h-full w-1/2 rounded-[3px] bg-candy-apple" />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[24px]">
          <p className="title-5 text-eerie-black">{title}</p>
          {children}
        </div>
      </div>
      <div className="flex w-full flex-1 items-start gap-[48px] bg-cultured px-[16px] pt-[16px] pb-[32px]">
        {footer}
      </div>
    </div>
  );
}

/**
 * Stand-in for the destination map. The Figma frame uses a raster map tile
 * that this environment cannot fetch, so the placeholder draws the same
 * shape — roads, water and a marker — at the same 120px height.
 */
export function MapPlaceholder() {
  return (
    <div className="h-[120px] w-full overflow-hidden rounded-t-card border-2 border-white bg-[#e8ece7]">
      <svg
        viewBox="0 0 408 120"
        preserveAspectRatio="none"
        className="size-full"
        role="img"
        aria-label="Map of the destination"
      >
        <rect width="408" height="120" fill="#eaefe9" />
        <path d="M300 0h108v120H300Z" fill="#bcd9e8" />
        <path
          d="M0 74h300M0 30h230M118 0v120M244 0v120"
          stroke="#ffffff"
          strokeWidth="7"
        />
        <path d="M0 52h408" stroke="#f6d98b" strokeWidth="9" />
        <circle cx="176" cy="63" r="9" fill="#ff1900" />
        <circle cx="176" cy="63" r="3.2" fill="#ffffff" />
      </svg>
    </div>
  );
}

/** Read-only field showing the selected project. */
export function ProjectField({ value }: { value: string }) {
  return (
    <div className="flex w-full flex-col gap-[8px]">
      <FieldLabel>Project</FieldLabel>
      <div className="flex h-[48px] w-full items-center gap-[8px] rounded-[2px] border border-cultured bg-white pr-[12px] pl-[8px]">
        <p className="title-5 flex-1 text-eerie-black">{value}</p>
        <ChevronDown size={18} className="text-eerie-black" />
      </div>
    </div>
  );
}

export function StartEndBlock({ start, end }: { start: string; end: string }) {
  return (
    <div className="flex w-full flex-col gap-[8px] rounded-card bg-smoke px-[12px] py-[8px]">
      <div className="flex items-center gap-[12px]">
        <p className="caption-2 text-silver-chalice">Start</p>
        <p className="caption-2 text-eerie-black">{start}</p>
      </div>
      <div className="flex w-[169px] items-center gap-[12px]">
        <p className="caption-2 text-silver-chalice">End</p>
        <p className="caption-2 flex-1 text-right text-eerie-black">{end}</p>
      </div>
    </div>
  );
}

export function LocationBlock({
  city,
  address,
}: {
  city: string;
  address: string;
}) {
  return (
    <div className="flex w-full flex-col gap-[4px] rounded-card border border-dashed border-cultured bg-smoke px-[12px] py-[8px]">
      <p className="caption-2 text-silver-chalice">Location</p>
      <p className="caption-2 text-eerie-black">{city}</p>
      <p className="caption-2 text-eerie-black">{address}</p>
    </div>
  );
}

export function GetDirectionButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-[6px] rounded-card border border-silver-chalice bg-white px-[24px] pt-[4px] pb-[3px]"
    >
      <PinIcon size={16} className="text-dodger-blue" />
      <span className="body-xs text-dodger-blue">Get direction</span>
    </button>
  );
}

/** Requester / date pair shown in the request details block. */
export function RequesterBlock({
  requester,
  date,
  time,
}: {
  requester: string;
  date: string;
  time: string;
}) {
  return (
    <div className="flex w-full items-start gap-[12px] rounded-t-card border-b border-cultured bg-smoke px-[12px] py-[12px]">
      <div className="flex flex-1 flex-col gap-[6px]">
        <p className="caption-2 font-bold text-silver-chalice">Requester</p>
        <p className="caption-2 font-bold text-eerie-black">{requester}</p>
      </div>
      <div className="flex flex-1 flex-col gap-[6px]">
        <p className="caption-2 font-bold text-silver-chalice">Date</p>
        <div className="flex items-center gap-[6px]">
          <p className="caption-2 font-bold text-eerie-black">{date}</p>
          <p className="caption-2 font-bold text-silver-chalice">{time}</p>
        </div>
      </div>
    </div>
  );
}
