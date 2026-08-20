import { ButtonLarge } from '../components/Buttons';
import { ArrowRight } from '../components/icons';
import { ShiftCalendarArt } from '../components/Artwork';
import { TrackingScreen } from './Tracking';

/** Figma node 2084:7357 — the start-of-shift state. */
export function Home() {
  return (
    <TrackingScreen
      tone="green"
      art={<ShiftCalendarArt />}
      headline="Good morning"
      statusLabel="In 9 min"
      statusValue="your shift starts"
      actions={
        <ButtonLarge to="/job" icon={<ArrowRight size={18} />}>
          Start Day
        </ButtonLarge>
      }
    />
  );
}
