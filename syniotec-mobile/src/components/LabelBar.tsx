import { Link } from 'react-router-dom';
import { CalendarIcon, UserIcon } from './icons';

type LabelBarProps = {
  title: string;
  subtitle: string;
  /** Right-hand affordance: the avatar puck, or the timesheet shortcut. */
  action?: 'avatar' | 'timesheet';
};

/**
 * Page label under the sheet's top edge — title, subtitle and either the
 * user puck or the link across to the timesheet.
 */
export function LabelBar({ title, subtitle, action = 'avatar' }: LabelBarProps) {
  return (
    <div className="relative flex h-[113px] w-full items-center justify-between px-[24px] pt-[40px] pb-[12px]">
      <div className="flex flex-col gap-[8px] whitespace-nowrap text-dark-sienna">
        <p className="title-3">{title}</p>
        <p className="body-xs">{subtitle}</p>
      </div>

      {action === 'avatar' ? (
        <div className="flex size-[60px] items-center justify-center rounded-full bg-cultured text-dark-sienna">
          <UserIcon size={28} />
        </div>
      ) : (
        <Link
          to="/timesheet"
          aria-label="Open timesheet"
          className="flex items-center justify-center rounded-[2px] border border-cultured bg-white p-[4px] text-eerie-black"
        >
          <CalendarIcon size={20} />
        </Link>
      )}
    </div>
  );
}
