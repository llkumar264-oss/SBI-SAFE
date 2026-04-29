import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : { username: 'Alex Kumar', email: 'alex@example.com' }
    } catch { return { username: 'Alex Kumar', email: 'alex@example.com' } }
  })

  const [alertCount, setAlertCount] = useState(3)
  const [protectionActive, setProtectionActive] = useState(true)
  const [scanHistory, setScanHistory] = useState([])

  const addScanResult = (result) => {
    setScanHistory(prev => [result, ...prev].slice(0, 50))
  }

  const markAlertsRead = () => setAlertCount(0)

  return (
    <AppContext.Provider value={{
      user, setUser,
      alertCount, setAlertCount, markAlertsRead,
      protectionActive, setProtectionActive,
      scanHistory, addScanResult,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
