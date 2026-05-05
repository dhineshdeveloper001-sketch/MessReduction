import { useState } from 'react'
import './App.css'
import AuthWrapper from './AuthWrapper'
import MessReductionPage from './MessReductionPage'
import Deputy_warden_side from './Deputy_warden_side'
import Warden from './Warden'
import HostelOffice from './Hostel_office'

// Route map: path → screen key (and optional warden year)
const PATH_MAP = {
  '/':          { screen: 'auth' },
  '/deputy':    { screen: 'deputy' },
  '/warden/1st':{ screen: 'warden', year: '1st' },
  '/warden/2nd':{ screen: 'warden', year: '2nd' },
  '/warden/3rd':{ screen: 'warden', year: '3rd' },
  '/warden/4th':{ screen: 'warden', year: '4th' },
  '/office':    { screen: 'office' },
};

const matched  = PATH_MAP[window.location.pathname] ?? { screen: 'auth' };

function App() {
  const [screen, setScreen] = useState(matched.screen);
  const wardenYear = matched.year ?? null;

  const handleLoginSuccess = () => setScreen('student');

  return (
    <div className="app-container">
      {screen === 'auth' && (
        <AuthWrapper onLoginSuccess={handleLoginSuccess} />
      )}

      {screen === 'student' && (
        <div className="relative">
          <MessReductionPage />
          <button
            onClick={() => {
              sessionStorage.removeItem("currentUser");
              setScreen('auth');
            }}
            className="fixed bottom-6 left-6 px-6 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all z-[100]"
          >
            Logout
          </button>
        </div>
      )}

      {screen === 'deputy' && <Deputy_warden_side />}

      {screen === 'warden' && <Warden assignedYear={wardenYear} />}

      {screen === 'office' && <HostelOffice />}

    </div>
  )
}

function navCls(href, current, inactive, active) {
  const isActive = current === href;
  return `px-3 py-2 rounded-md text-xs font-bold border transition-all text-center ${isActive ? active : inactive}`;
}

export default App
