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

/** Google Maps' default roadmap palette, sampled from the Figma tile. */
const MAP = {
  land: '#eceae4',
  builtUp: '#e6e3dc',
  vegetation: '#cfe4bd',
  water: '#a3d2f0',
  localRoad: '#ffffff',
  localCasing: '#dedad2',
  arterial: '#f6c98a',
  arterialCasing: '#e8b268',
  highway: '#f3b25c',
  highwayCasing: '#dd9a44',
  shield: '#3f9b5c',
  label: '#5f5f5f',
} as const;

/**
 * The destination map.
 *
 * The Figma frame (node 2084:7658) fills this slot with a raster tile of
 * Google Maps in its default roadmap style. Rasters cannot be exported back
 * through the MCP text channel and figma.com is blocked by egress policy, so
 * `src` is left unset here and the component draws a stand-in in that same
 * default palette — pale land, green cover, blue water, a white local-road
 * mesh over orange arterials, and a place label.
 *
 * Pass `src` to swap in the real thing: either the tile exported from Figma,
 * or a live Google Static Maps URL, e.g.
 * `https://maps.googleapis.com/maps/api/staticmap?center=Halensee,Berlin&zoom=13&size=408x120&scale=2&key=…`
 */
export function DestinationMap({
  src,
  label = 'Halensee',
}: {
  src?: string;
  label?: string;
}) {
  return (
    <div
      className="h-[120px] w-full overflow-hidden rounded-t-card border-2 border-white"
      style={{ backgroundColor: MAP.land }}
    >
      {src ? (
        <img
          src={src}
          alt={`Map showing ${label}`}
          className="size-full object-cover"
        />
      ) : (
        <svg
          viewBox="0 0 408 120"
          className="size-full"
          role="img"
          aria-label={`Map showing ${label}`}
        >
          <rect width="408" height="120" fill={MAP.land} />

          {/* Vegetation and built-up blocks. */}
          <path d="M0 0h96v46H0Z" fill={MAP.vegetation} opacity="0.85" />
          <path d="M18 78h74v42H18Z" fill={MAP.vegetation} opacity="0.7" />
          <path d="M286 0h40v30h-40Z" fill={MAP.vegetation} opacity="0.6" />
          <path d="M150 44h96v40h-96Z" fill={MAP.builtUp} />

          {/* Water along the right edge, as in the tile. */}
          <path
            d="M352 0h56v120h-56c8-20 4-38-2-58s-2-42 2-62Z"
            fill={MAP.water}
          />

          {/* Local road mesh: white fill over a soft casing. */}
          <g
            stroke={MAP.localCasing}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          >
            <path d="M0 30h352M0 66h352M0 98h352M62 0v120M138 0v120M212 0v120M286 0v120M330 0v120" />
          </g>
          <g
            stroke={MAP.localRoad}
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          >
            <path d="M0 30h352M0 66h352M0 98h352M62 0v120M138 0v120M212 0v120M286 0v120M330 0v120" />
          </g>

          {/* Arterials and the highway running to the water. */}
          <g fill="none" strokeLinecap="round">
            <path
              d="M0 50h352"
              stroke={MAP.arterialCasing}
              strokeWidth="7.5"
            />
            <path d="M0 50h352" stroke={MAP.arterial} strokeWidth="5" />
            <path
              d="M176 0v52c0 26 26 34 52 40s60 12 84 28"
              stroke={MAP.highwayCasing}
              strokeWidth="8"
            />
            <path
              d="M176 0v52c0 26 26 34 52 40s60 12 84 28"
              stroke={MAP.highway}
              strokeWidth="5.5"
            />
          </g>

          {/* Route shield and place label, as the tile shows them. */}
          <circle cx="374" cy="70" r="9" fill={MAP.shield} />
          <text
            x="374"
            y="74"
            textAnchor="middle"
            fontSize="10"
            fontFamily="Montserrat, sans-serif"
            fontWeight="600"
            fill="#ffffff"
          >
            19
          </text>
          <text
            x="196"
            y="40"
            textAnchor="middle"
            fontSize="13"
            fontFamily="Montserrat, sans-serif"
            fontWeight="600"
            fill={MAP.label}
          >
            {label}
          </text>
        </svg>
      )}
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
