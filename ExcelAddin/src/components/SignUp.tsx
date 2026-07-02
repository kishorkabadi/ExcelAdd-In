import React, { useState } from 'react'
import {
  Stack,
  TextField,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Spinner,
  ProgressIndicator,
} from '@fluentui/react'
import { validatePassword } from '../utils/validationHelper'
import { AuthService } from '../services/AuthService'

interface SignUpProps {
  onSignUpSuccess: () => void
  onBackToLogin: () => void
}

const SignUp: React.FC<SignUpProps> = ({ onSignUpSuccess, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value })
    const validation = validatePassword(value)
    setPasswordErrors(validation.errors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.email || !formData.username || !formData.password || !formData.firstName) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      setError('Password does not meet requirements')
      return
    }

    setLoading(true)

    try {
      // Call signup API
      // await AuthService.signup(formData)
      onSignUpSuccess()
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.')
      console.error('Sign up error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack
      styles={{
        root: {
          width: '100%',
          maxWidth: 450,
          margin: '0 auto',
          marginTop: 50,
          padding: 20,
        },
      }}
      tokens={{ childrenGap: 16 }}
    >
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#0078d4' }}>Create Account</h1>
        <p style={{ margin: 0, color: '#666' }}>Join Excel Enterprise</p>
      </div>

      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

      <form onSubmit={handleSubmit}>
        <Stack tokens={{ childrenGap: 12 }}>
          <Stack horizontal tokens={{ childrenGap: 12 }}>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(_, value) => setFormData({ ...formData, firstName: value || '' })}
              placeholder="John"
              disabled={loading}
              styles={{ root: { flex: 1 } }}
            />
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(_, value) => setFormData({ ...formData, lastName: value || '' })}
              placeholder="Doe"
              disabled={loading}
              styles={{ root: { flex: 1 } }}
            />
          </Stack>

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(_, value) => setFormData({ ...formData, email: value || '' })}
            placeholder="john@example.com"
            disabled={loading}
          />

          <TextField
            label="Username"
            value={formData.username}
            onChange={(_, value) => setFormData({ ...formData, username: value || '' })}
            placeholder="johndoe"
            disabled={loading}
          />

          <div>
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(_, value) => handlePasswordChange(value || '')}
              placeholder="Enter a strong password"
              disabled={loading}
              canRevealPassword
            />
            {passwordErrors.length > 0 && (
              <div style={{ fontSize: 12, marginTop: 8, color: '#d13438' }}>
                <p style={{ margin: '0 0 4px 0' }}>Password must:</p>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {passwordErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <TextField
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(_, value) => setFormData({ ...formData, confirmPassword: value || '' })}
            placeholder="Re-enter your password"
            disabled={loading}
          />

          <PrimaryButton
            text={loading ? 'Creating account...' : 'Create Account'}
            onClick={handleSubmit}
            disabled={loading}
            type="submit"
          />

          <DefaultButton
            text="Back to Login"
            onClick={onBackToLogin}
            disabled={loading}
          />
        </Stack>
      </form>

      {loading && <Spinner label="Creating your account..." />}
    </Stack>
  )
}

export default SignUp
