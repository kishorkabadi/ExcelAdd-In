import React, { useState, useEffect } from 'react'
import { Spinner } from '@fluentui/react'
import Login from './Login'
import SignUp from './SignUp'
import ForgotPassword from './ForgotPassword'
import MainPage from './MainPage'
import { useAuth } from '../hooks/useAuth'
import ErrorBoundary from './ErrorBoundary'
import ProtectedRoute from './ProtectedRoute'

type AuthPage = 'login' | 'signup' | 'forgot-password'

const AuthContainer: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<AuthPage>('login')
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken')
    const rememberMe = localStorage.getItem('rememberMe')
    
    setIsInitializing(false)
  }, [])

  if (isInitializing) {
    return <Spinner label="Initializing..." />
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        {currentPage === 'login' && (
          <Login
            onLoginSuccess={(token) => {
              localStorage.setItem('authToken', token)
              window.location.reload()
            }}
          />
        )}
        {currentPage === 'signup' && (
          <SignUp
            onSignUpSuccess={() => setCurrentPage('login')}
            onBackToLogin={() => setCurrentPage('login')}
          />
        )}
        {currentPage === 'forgot-password' && (
          <ForgotPassword onBackToLogin={() => setCurrentPage('login')} />
        )}
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <ProtectedRoute onSessionExpired={() => logout()}>
        <MainPage onLogout={() => logout()} />
      </ProtectedRoute>
    </ErrorBoundary>
  )
}

export default AuthContainer
