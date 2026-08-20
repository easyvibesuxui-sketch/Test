import logoUrl from '../assets/icons/logo-syniotec.svg';

/**
 * The Syniotec wordmark, exported from Figma node 2:73 through the Plugin
 * API (`exportAsync({ format: 'SVG_STRING' })`) at its native 151×28.
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="Syniotec"
      width={151}
      height={28}
      className={className}
    />
  );
}
