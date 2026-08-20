import { ButtonLarge } from '../components/Buttons';
import { LabelBar } from '../components/LabelBar';
import { PlusIcon } from '../components/icons';
import { RequestRow } from '../components/RequestRow';
import { CardSection, GreyRegion, Sheet } from '../components/Surfaces';
import { TabSwitcher } from '../components/TabSwitcher';
import { OPEN_REQUESTS, REQUEST_HISTORY } from '../data/fixtures';

/** Figma node 2084:7809 — open requests plus the decided history. */
export function Requests() {
  return (
    <Sheet>
      <LabelBar
        title="Time Tracking"
        subtitle="Upcoming Transportations"
        action="timesheet"
      />
      <TabSwitcher />
      <GreyRegion>
        <div className="flex w-full flex-col gap-[8px]">
          <CardSection title="Your Requests">
            {OPEN_REQUESTS.map((item, i) => (
              <RequestRow key={i} item={item} />
            ))}
          </CardSection>
          <ButtonLarge
            to="/requests/new"
            variant="outline"
            icon={<PlusIcon size={18} />}
            className="rounded-[2px]"
          >
            New Request
          </ButtonLarge>
        </div>

        <CardSection
          title="History"
          bodyClassName="bg-cultured border-2 border-white"
        >
          {REQUEST_HISTORY.map((item, i) => (
            <RequestRow key={i} item={item} />
          ))}
        </CardSection>
      </GreyRegion>
    </Sheet>
  );
}
