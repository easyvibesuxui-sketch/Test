import type { ReactNode } from 'react';

/** White sheet that rounds over the dark header. */
export function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center rounded-t-sheet bg-white">
      {children}
    </div>
  );
}

/**
 * The grey scroll region nested inside the white sheet, holding the cards.
 */
export function GreyRegion({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-[32px] rounded-t-sheet bg-cultured px-[24px] pt-[32px] pb-[48px]">
      {children}
    </div>
  );
}

/** Titled card group: a 16px label followed by the snow-white card body. */
export function CardSection({
  title,
  children,
  bodyClassName = '',
}: {
  title: string;
  children: ReactNode;
  bodyClassName?: string;
}) {
  return (
    <section className="flex w-full flex-col items-start gap-[8px]">
      <h2 className="title-3 w-full text-dark-sienna">{title}</h2>
      <div
        className={`flex w-full flex-col items-center justify-center gap-[8px] rounded-card bg-snow p-[16px] ${bodyClassName}`}
      >
        {children}
      </div>
    </section>
  );
}

/**
 * A row inside a card. `tone` follows the Figma variants: the default pale
 * blue, plus the rose wash used for declined/attention rows.
 */
export function TrackerRow({
  children,
  tone = 'default',
  className = '',
}: {
  children: ReactNode;
  tone?: 'default' | 'rose' | 'plain';
  className?: string;
}) {
  const tones = {
    default: 'bg-tracker/64',
    rose: 'bg-misty-rose',
    plain: 'bg-tracker',
  } as const;
  return (
    <div
      className={`flex w-full flex-col items-start gap-[8px] rounded-tracker p-[12px] ${tones[tone]} ${className}`}
    >
      {children}
    </div>
  );
}

/** Small grey caption used above every field group. */
export function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="title-5 w-full text-silver-chalice">{children}</p>;
}
