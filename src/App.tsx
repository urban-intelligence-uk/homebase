import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Compliance from './pages/Compliance';
import Documents from './pages/Documents';
import Governance from './pages/Governance';
import Finances from './pages/Finances';
import WorksProgramme from './pages/WorksProgramme';
import Issues from './pages/Issues';
import Messages from './pages/Messages';
import Assistant from './pages/Assistant';
import Workflows from './pages/Workflows';
import Marketplace from './pages/Marketplace';
import Help from './pages/Help';
import Onboarding from './pages/Onboarding';

function App() {
  return (
    <Routes>
      {/* Standalone route — no sidebar */}
      <Route path="/welcome" element={<Onboarding />} />

      {/* All other routes wrapped in AppLayout */}
      <Route
        path="*"
        element={
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/works" element={<WorksProgramme />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/issues" element={<Issues />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;
