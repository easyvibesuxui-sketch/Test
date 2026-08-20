import { ClockTwentyFour, PauseIcon, StopIcon } from '../components/icons';
import { TrackingAction, TrackingScreen } from './Tracking';

/** Figma node 2084:8451 — the at-work state. */
export function Working() {
  return (
    <TrackingScreen
      art={<ClockTwentyFour size={96} />}
      headline="Have a successful day"
      statusLabel="At work"
      statusValue="4 H and 47m"
      project="Halensee Roadworks"
      actions={
        <>
          <TrackingAction
            label="End Day"
            to="/"
            variant="outline"
            icon={<StopIcon size={20} />}
          />
          <TrackingAction
            label="Pause"
            to="/break"
            variant="dark"
            icon={<PauseIcon size={20} />}
          />
        </>
      }
    />
  );
}
