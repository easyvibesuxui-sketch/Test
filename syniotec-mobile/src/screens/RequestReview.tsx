import { useNavigate } from 'react-router-dom';
import {
  DetailSheet,
  GetDirectionButton,
  LocationBlock,
  MapPlaceholder,
  ProjectField,
  RequesterBlock,
  StartEndBlock,
} from '../components/DetailSheet';
import { FieldLabel } from '../components/Surfaces';

const ADDITIONAL_INFORMATION =
  'Transport (in British English) or transportation (in American English) is the intentional movement of humans, animals, and goods from one location to another. Modes of transport include air, land (rail and road), water, cable, pipelines, and space.';

/** Figma node 2084:8950 — reviewing an incoming request. */
export function RequestReview() {
  const navigate = useNavigate();

  return (
    <DetailSheet
      title="New Request"
      footer={
        <>
          <button
            type="button"
            onClick={() => navigate('/requests')}
            className="flex h-[48px] w-[180px] items-center justify-center rounded-card border border-eerie-black bg-smoke px-[32px] py-[10px] font-body text-[14px] font-medium text-eerie-black"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => navigate('/requests')}
            className="flex h-[48px] w-[180px] items-center justify-center rounded-card bg-mantis px-[32px] py-[10px] font-body text-[14px] font-medium text-snow"
          >
            Confirm
          </button>
        </>
      }
    >
      <section className="flex w-full flex-col gap-[8px]">
        <FieldLabel>Destination</FieldLabel>
        <div className="flex w-full flex-col">
          <MapPlaceholder />
          <div className="flex w-full flex-col rounded-b-card bg-white">
            <div className="flex w-full flex-col gap-[12px] border-b border-cultured px-[12px] pt-[12px] pb-[24px]">
              <ProjectField value="Halensee Roadworks" />
              <div className="flex w-full flex-col gap-[16px]">
                <StartEndBlock
                  start="16 October 2025  08:00 AM"
                  end="17 October 2025  13:45 PM"
                />
                <LocationBlock
                  city="Halensee, Germany."
                  address="5 Franziuseck Bremen, 28199 DE, Germany"
                />
              </div>
              <GetDirectionButton />
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-[8px]">
        <FieldLabel>Request Details</FieldLabel>
        <div className="flex w-full flex-col">
          <RequesterBlock
            requester="Max Mustermann"
            date="21.08.2026"
            time="14:45"
          />
          <div className="flex w-full flex-col gap-[4px] rounded-b-card border border-cultured bg-smoke px-[12px] pt-[8px] pb-[12px]">
            <p className="caption-2 text-silver-chalice">
              Additional Information
            </p>
            <p className="caption-1 text-eerie-black">
              {ADDITIONAL_INFORMATION}
            </p>
          </div>
        </div>
      </section>
    </DetailSheet>
  );
}
