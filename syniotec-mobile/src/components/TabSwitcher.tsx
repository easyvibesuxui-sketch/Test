import { NavLink } from 'react-router-dom';

const TABS = [
  { label: 'Home', to: '/' },
  { label: 'Planning', to: '/planning' },
  { label: 'Requests', to: '/requests' },
] as const;

/** Home / Planning / Requests switcher; the active tab inverts to black. */
export function TabSwitcher() {
  return (
    <nav className="flex w-full items-center justify-center px-[24px]">
      {TABS.map(({ label, to }) => (
        <NavLink
          key={label}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            [
              'title-5 flex h-[48px] flex-1 items-center justify-center px-[4px] py-[10px] text-center transition-colors',
              isActive
                ? 'bg-eerie-black text-snow'
                : 'bg-white text-eerie-black',
            ].join(' ')
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
