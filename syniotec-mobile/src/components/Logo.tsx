/**
 * The Syniotec wordmark. The original is an outlined SVG asset in Figma that
 * this environment cannot fetch, so it is set as type with the accent square
 * the mark carries above the "i".
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`relative select-none ${className}`}>
      <span className="font-title text-[26px] leading-[28px] font-medium tracking-[0.02em] text-white">
        syniotec
      </span>
      <span className="absolute -top-[2px] left-[45px] block h-[5px] w-[5px] bg-candy-apple" />
    </div>
  );
}
