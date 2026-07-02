import { useState, useEffect } from 'react'
import { initializeIcons } from '@fluentui/react-icons'
import TaskPane from './components/TaskPane'
import { AuthService } from './services/AuthService'
import { initOffice } from './utils/officeHelper'

initializeIcons()

function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Office.onReady((info) => {
      if (info.host === Office.HostType.Excel) {
        console.log('Office Add-in ready')
        setIsInitialized(true)
        initOffice()
        checkAuthentication()
      }
    })
  }, [])

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token && !AuthService.isTokenExpired(token)) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isInitialized || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <TaskPane onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <div>Login Required</div>
      )}
    </div>
  )
}

export default App
