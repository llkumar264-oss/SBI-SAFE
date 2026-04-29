import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import HomeScreen from './screens/HomeScreen'
import ScanScreen from './screens/ScanScreen'
import AlertsScreen from './screens/AlertsScreen'
import MapScreen from './screens/MapScreen'
import CommunityScreen from './screens/CommunityScreen'
import ProfileScreen from './screens/ProfileScreen'

// ─── SVG Icons for Bottom Nav ──────────────────────────────────────────────────
const HomeIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const ScanIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
)

const MapIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
  </svg>
)

const CommunityIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const ProfileIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const SCREENS = {
  home: HomeScreen,
  scan: ScanScreen,
  alerts: AlertsScreen,
  map: MapScreen,
  community: CommunityScreen,
  profile: ProfileScreen,
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'scan', label: 'Scan', icon: ScanIcon },
  { id: 'map', label: 'Map', icon: MapIcon },
  { id: 'community', label: 'Community', icon: CommunityIcon },
  { id: 'profile', label: 'Profile', icon: ProfileIcon },
]

function AppInner() {
  const [activeScreen, setActiveScreen] = useState('home')
  const Screen = SCREENS[activeScreen] || HomeScreen

  return (
    <div className="app-shell">
      {/* Main Screen */}
      <Screen onNavigate={setActiveScreen} />

      {/* Bottom Navigation */}
      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            id={`nav-${id}`}
            className={`nav-item ${activeScreen === id ? 'active' : ''}`}
            onClick={() => setActiveScreen(id)}
            role="button"
            aria-label={label}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setActiveScreen(id)}
          >
            <Icon />
            <span className="nav-label">{label}</span>
          </div>
        ))}
      </nav>

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0d1b2a',
            color: '#f0f4ff',
            border: '1px solid rgba(0,198,255,0.2)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontFamily: 'Inter, sans-serif',
            maxWidth: '360px',
          },
          success: {
            iconTheme: { primary: '#00ff88', secondary: '#0d1b2a' },
          },
          error: {
            iconTheme: { primary: '#ff3a3a', secondary: '#0d1b2a' },
          },
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
