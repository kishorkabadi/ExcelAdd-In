import React, { useState, useEffect } from 'react'
import { Stack, Text, Spinner, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react'
import { AuthService } from '../services/AuthService'

interface ProtectedRouteProps {
  children: React.ReactNode
  onSessionExpired: () => void
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onSessionExpired }) => {
  const [isValid, setIsValid] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionWarning, setSessionWarning] = useState(false)

  useEffect(() => {
    const validateSession = () => {
      const token = localStorage.getItem('authToken')
      if (!token || AuthService.isTokenExpired(token)) {
        setIsValid(false)
        onSessionExpired()
      }
      setIsLoading(false)
    }

    validateSession()

    // Check session every 5 minutes
    const interval = setInterval(validateSession, 5 * 60 * 1000)

    // Warn about expiration 5 minutes before it expires
    const expiry = localStorage.getItem('tokenExpiry')
    if (expiry) {
      const timeUntilExpiry = parseInt(expiry) - Date.now()
      const warningTime = timeUntilExpiry - 5 * 60 * 1000
      if (warningTime > 0) {
        const warningTimeout = setTimeout(() => {
          setSessionWarning(true)
        }, warningTime)
        return () => clearTimeout(warningTimeout)
      }
    }

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return <Spinner label="Validating session..." />
  }

  if (!isValid) {
    return (
      <Stack styles={{ root: { padding: 20 } }} tokens={{ childrenGap: 16 }}>
        <MessageBar messageBarType={MessageBarType.error}>
          Your session has expired. Please log in again.
        </MessageBar>
      </Stack>
    )
  }

  return (
    <>
      {sessionWarning && (
        <MessageBar messageBarType={MessageBarType.warning}>
          Your session will expire in 5 minutes. Please save your work.
          <PrimaryButton
            text="Refresh Session"
            onClick={async () => {
              try {
                await AuthService.refreshToken()
                setSessionWarning(false)
              } catch (err) {
                console.error('Failed to refresh session:', err)
              }
            }}
            styles={{ root: { marginLeft: 8 } }}
          />
        </MessageBar>
      )}
      {children}
    </>
  )
}

export default ProtectedRoute
