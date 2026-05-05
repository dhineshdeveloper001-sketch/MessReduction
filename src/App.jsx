import { useState } from 'react'
import './App.css'
import AuthWrapper from './AuthWrapper'
import MessReductionPage from './MessReductionPage'
import Deputy_warden_side from './Deputy_warden_side'
import Warden from './Warden'
import HostelOffice from './Hostel_office'
import StaffLogin from './StaffLogin'

// Route map: path → screen key (and optional warden year)
const PATH_MAP = {
  '/':             { screen: 'auth' },
  '/staff-login':  { screen: 'staff-login' },
  '/deputy':       { screen: 'deputy' },
  '/warden/1st':   { screen: 'warden', year: '1st' },
  '/warden/2nd':   { screen: 'warden', year: '2nd' },
  '/warden/3rd':   { screen: 'warden', year: '3rd' },
  '/warden/4th':   { screen: 'warden', year: '4th' },
  '/office':       { screen: 'office' },
};

const matched = PATH_MAP[window.location.pathname] ?? { screen: 'auth' };

// Staff pages require a staffToken — redirect to staff-login if missing
const staffPages = ['deputy', 'warden', 'office'];
const isStaffPage = staffPages.includes(matched.screen);
const hasStaffToken = !!sessionStorage.getItem('staffToken');
const initialScreen = (isStaffPage && !hasStaffToken)
  ? 'staff-login'
  : matched.screen;

function App() {
  const [screen, setScreen] = useState(initialScreen);
  const wardenYear = matched.year ?? null;

  const handleLoginSuccess = () => setScreen('student');

  const handleStaffLogout = () => {
    sessionStorage.removeItem("staffToken");
    sessionStorage.removeItem("staffUser");
    window.location.href = '/staff-login';
  };

  return (
    <div className="app-container">
      {screen === 'auth' && (
        <AuthWrapper onLoginSuccess={handleLoginSuccess} />
      )}

      {screen === 'staff-login' && <StaffLogin />}

      {screen === 'student' && (
        <div className="relative">
          <MessReductionPage />
          <button
            onClick={() => {
              sessionStorage.removeItem("currentUser");
              sessionStorage.removeItem("token");
              setScreen('auth');
            }}
            className="fixed bottom-4 left-4 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] text-rose-400 font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all z-[100]"
          >
            Logout
          </button>
        </div>
      )}

      {screen === 'deputy' && <Deputy_warden_side onLogout={handleStaffLogout} />}

      {screen === 'warden' && <Warden assignedYear={wardenYear} onLogout={handleStaffLogout} />}

      {screen === 'office' && <HostelOffice onLogout={handleStaffLogout} />}

    </div>
  )
}

export default App
