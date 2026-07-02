import React, { useState } from 'react'
import {
  Stack,
  TextField,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Spinner,
  Link,
  Checkbox,
} from '@fluentui/react'
import { AuthService } from '../services/AuthService'

interface LoginProps {
  onLoginSuccess: (token: string) => void
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!username || !password) {
        setError('Username and password are required')
        return
      }

      const result = await AuthService.login({
        username,
        password,
      })

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('username', username)
      } else {
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('username')
      }

      onLoginSuccess(result.accessToken)
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack
      styles={{
        root: {
          width: '100%',
          maxWidth: 400,
          margin: '0 auto',
          marginTop: 100,
          padding: 20,
        },
      }}
      tokens={{ childrenGap: 16 }}
    >
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#0078d4' }}>Excel Enterprise</h1>
        <p style={{ margin: 0, color: '#666' }}>Sign in to your account</p>
      </div>

      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

      <form onSubmit={handleLogin}>
        <Stack tokens={{ childrenGap: 12 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(_, value) => setUsername(value || '')}
            placeholder="Enter your username"
            disabled={loading}
            autoFocus
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(_, value) => setPassword(value || '')}
            placeholder="Enter your password"
            disabled={loading}
            canRevealPassword
            revealPasswordAriaLabel="Show password"
            hidePasswordAriaLabel="Hide password"
          />

          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onChange={(_, checked) => setRememberMe(checked || false)}
            disabled={loading}
          />

          <PrimaryButton
            text={loading ? 'Signing in...' : 'Sign In'}
            onClick={handleLogin}
            disabled={loading || !username || !password}
            type="submit"
          />

          <Stack horizontal tokens={{ childrenGap: 8 }} horizontalAlign="center">
            <Link>Forgot password?</Link>
            <span>•</span>
            <Link>Sign up</Link>
          </Stack>
        </Stack>
      </form>

      {loading && <Spinner label="Authenticating..." />}
    </Stack>
  )
}

export default Login
