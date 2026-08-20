/**
 * The Syniotec wordmark (Figma node 2:73) — set in ABC Favorit Expanded
 * Medium, the same typeface the artwork is drawn from, at the 151×28 box the
 * header uses.
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-title inline-flex items-center text-[27px] leading-[28px] font-medium tracking-[-0.01em] text-white select-none ${className}`}
    >
      syniotec
    </span>
  );
}
