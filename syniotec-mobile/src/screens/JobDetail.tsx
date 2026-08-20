import { useNavigate } from 'react-router-dom';
import { SwipeButton } from '../components/Buttons';
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

const TASK_DESCRIPTION =
  'Transport (in British English) or transportation (in American English) is the intentional movement of humans, animals, and goods from one location to another. Modes of transport include air, land (rail and road), water, cable, pipelines, and space.';

/** Figma node 2084:7635 — the job briefing shown before starting the day. */
export function JobDetail() {
  const navigate = useNavigate();

  return (
    <DetailSheet
      title="Start day"
      footer={<SwipeButton onCommit={() => navigate('/working')} />}
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
        <FieldLabel>Task description</FieldLabel>
        <div className="w-full rounded-card border border-cultured bg-smoke p-[12px]">
          <p className="caption-1 text-eerie-black">{TASK_DESCRIPTION}</p>
        </div>
      </section>

      <section className="flex w-full flex-col gap-[8px]">
        <FieldLabel>Request Details</FieldLabel>
        <RequesterBlock
          requester="Max Mustermann"
          date="21.08.2026"
          time="14:45"
        />
      </section>
    </DetailSheet>
  );
}
