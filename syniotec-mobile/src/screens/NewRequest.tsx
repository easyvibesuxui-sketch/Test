import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonLarge } from '../components/Buttons';
import { DetailSheet } from '../components/DetailSheet';
import { FieldLabel } from '../components/Surfaces';
import { CalendarIcon, PlusIcon } from '../components/icons';
import { ReasonGlyph } from '../components/Artwork';

const REASONS = [
  'Sick',
  'Vacation',
  'School',
  'Training',
  'Parental Leave',
  'Other',
] as const;

function DateInput({ placeholder }: { placeholder: string }) {
  return (
    <label className="flex h-[36px] flex-1 items-center gap-[8px] border border-cultured bg-white pr-[12px] pl-[16px] first:rounded-l-[2px] last:rounded-r-[2px]">
      <input
        type="text"
        placeholder={placeholder}
        className="body-s w-full flex-1 font-normal text-eerie-black outline-none placeholder:text-silver-chalice"
      />
      <CalendarIcon size={16} className="shrink-0 text-eerie-black" />
    </label>
  );
}

/** Figma node 2084:7723 — the new absence request form. */
export function NewRequest() {
  const navigate = useNavigate();
  const [reason, setReason] = useState<string | null>(null);

  return (
    <DetailSheet
      title="New Request"
      footer={
        <ButtonLarge
          icon={<PlusIcon size={18} />}
          onClick={() => navigate('/requests')}
        >
          Send Request
        </ButtonLarge>
      }
    >
      <section className="flex w-full flex-col gap-[8px]">
        <FieldLabel>Request dates</FieldLabel>
        <div className="flex h-[64px] w-full items-center justify-center rounded-card border-b border-cultured bg-smoke px-[12px] py-[16px]">
          <div className="flex w-full items-center">
            <DateInput placeholder="Start date" />
            <DateInput placeholder="End date" />
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-[8px]">
        <FieldLabel>Reason for request</FieldLabel>
        <div className="grid w-full grid-cols-2 gap-[20px]">
          {REASONS.map((label) => {
            const active = reason === label;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => setReason(label)}
                className={`flex h-[36px] items-center gap-[12px] justify-self-start rounded-card py-[2px] pr-[16px] pl-[8px] ${
                  active
                    ? 'bg-eerie-black text-white'
                    : 'bg-white text-eerie-black'
                }`}
              >
                <ReasonGlyph reason={label} size={32} />
                <span className="title-4 whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex w-full flex-col gap-[8px]">
        <FieldLabel>Further information</FieldLabel>
        <div className="flex h-[134px] w-full flex-col items-center rounded-card border-b border-cultured bg-smoke px-[12px] py-[4px]">
          <textarea
            placeholder="First name"
            className="body-s h-[122px] w-full resize-none rounded-[2px] border border-cultured bg-white px-[8px] py-[4px] font-normal text-eerie-black outline-none placeholder:text-silver-chalice"
          />
        </div>
      </section>
    </DetailSheet>
  );
}
