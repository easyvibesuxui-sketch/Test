import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from './icons';
import { Logo } from './Logo';

/**
 * Frame chrome shared by every screen: the 440px dark canvas, the 109px
 * header with the back chevron, wordmark and tagline. Screens supply the
 * body that sits on the dark ground.
 */
export function PhoneShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-full w-[440px] flex-col bg-eerie-black">
      <header className="flex h-[109px] w-full shrink-0 items-end gap-[40px] pr-[24px]">
        <div className="flex h-[109px] w-[60px] items-center justify-center pt-[44px] pb-[25px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex size-[36px] items-center justify-center rounded-[2px] text-cultured"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-[21px]">
          <Logo className="h-[28px] w-[151px]" />
          <p className="title-4 text-center whitespace-nowrap text-cultured">
            Softweare Asset manager
          </p>
        </div>
      </header>
      {children}
    </div>
  );
}
