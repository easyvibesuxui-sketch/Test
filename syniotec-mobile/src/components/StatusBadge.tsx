export type RequestStatus =
  | 'Pending'
  | 'Approved'
  | 'Declined'
  | 'Finished';

/** Colour mapping taken from the Figma status chips. */
const STYLES: Record<RequestStatus, string> = {
  Pending: 'bg-honey text-cultured',
  Approved: 'bg-mantis text-white',
  Declined: 'bg-amber text-white',
  Finished: 'bg-honey text-cultured',
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`body-s flex items-center justify-center rounded-card border border-cultured p-[8px] text-center leading-[18px] whitespace-nowrap ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
