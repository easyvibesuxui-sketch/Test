import { PlayIcon, StopIcon } from '../components/icons';
import { CupArt } from '../components/Artwork';
import { TrackingAction, TrackingScreen } from './Tracking';

/** Figma node 2084:8700 — the on-break state. */
export function Break() {
  return (
    <TrackingScreen
      art={<CupArt />}
      headline="Enjoy your time"
      statusLabel="At Brake"
      statusValue="47m"
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
            label="Resume"
            to="/working"
            variant="dark"
            icon={<PlayIcon size={20} />}
          />
        </>
      }
    />
  );
}
