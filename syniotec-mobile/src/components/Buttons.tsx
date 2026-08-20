import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from './icons';

type Variant = 'primary' | 'outline' | 'dark' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-amber text-white',
  dark: 'bg-eerie-black text-white',
  outline: 'border border-eerie-black bg-white text-eerie-black',
  ghost: 'border border-silver-chalice bg-white text-eerie-black',
};

type ButtonLargeProps = {
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  to?: string;
  className?: string;
} & Omit<ComponentProps<'button'>, 'className' | 'children'>;

/** The 56px full-width action button used at the foot of most screens. */
export function ButtonLarge({
  children,
  variant = 'primary',
  icon,
  to,
  className = '',
  ...rest
}: ButtonLargeProps) {
  const classes = `flex h-[56px] w-full items-center justify-center gap-[8px] rounded-card px-[32px] py-[10px] font-body text-[16px] font-medium ${VARIANTS[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {icon}
      {children}
    </button>
  );
}

/**
 * "Swipe to start" pill. The Figma component is a static visual, so this
 * keeps the same shape and treats a click on the knob as the commit action.
 */
export function SwipeButton({
  label = 'Swipe to start',
  onCommit,
}: {
  label?: string;
  onCommit?: () => void;
}) {
  return (
    <div className="relative h-[56px] w-full rounded-[100px] border border-cultured bg-gradient-to-r from-[#dacdcd] to-white">
      <p className="title-4 absolute top-[17px] left-1/2 -translate-x-1/2 text-silver-chalice opacity-40">
        {label}
      </p>
      <button
        type="button"
        onClick={onCommit}
        aria-label={label}
        className="absolute top-[3px] left-[8px] flex size-[48px] items-center justify-center rounded-[48px] bg-candy-apple text-white"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
