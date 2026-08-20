import { Route, Routes } from 'react-router-dom';
import { PhoneShell } from './components/PhoneShell';
import { Home } from './screens/Home';
import { JobDetail } from './screens/JobDetail';
import { Working } from './screens/Working';
import { Break } from './screens/Break';
import { Requests } from './screens/Requests';
import { NewRequest } from './screens/NewRequest';
import { RequestReview } from './screens/RequestReview';
import { Planning } from './screens/Planning';
import { Timesheet, TimesheetMonth } from './screens/Timesheet';

/**
 * One route per frame on the Figma page "Timetracking David"
 * (file nGNChppV1Lm9eoEndNzrsN, node 2084:7356).
 */
export function App() {
  return (
    <PhoneShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job" element={<JobDetail />} />
        <Route path="/working" element={<Working />} />
        <Route path="/break" element={<Break />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/requests/new" element={<NewRequest />} />
        <Route path="/requests/review" element={<RequestReview />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/timesheet" element={<Timesheet />} />
        <Route path="/timesheet/month" element={<TimesheetMonth />} />
      </Routes>
    </PhoneShell>
  );
}
