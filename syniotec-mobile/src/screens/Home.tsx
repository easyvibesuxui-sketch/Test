import { ButtonLarge } from '../components/Buttons';
import { AlarmClock, ArrowRight } from '../components/icons';
import { TrackingScreen } from './Tracking';

/** Figma node 2084:7357 — the start-of-shift state. */
export function Home() {
  return (
    <TrackingScreen
      tone="green"
      art={<AlarmClock size={96} />}
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
