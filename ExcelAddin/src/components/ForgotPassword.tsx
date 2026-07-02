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
} from '@fluentui/react'
import { AuthService } from '../services/AuthService'

interface ForgotPasswordProps {
  onBackToLogin: () => void
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email) {
        setError('Email is required')
        return
      }
      // API call to request password reset
      // await AuthService.requestPasswordReset(email)
      setSuccess('Check your email for reset code')
      setStep('code')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!code) {
        setError('Reset code is required')
        return
      }
      // API call to verify code
      // await AuthService.verifyResetCode(email, code)
      setSuccess('')
      setStep('reset')
    } catch (err: any) {
      setError(err.message || 'Invalid reset code')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters')
        return
      }
      // API call to reset password
      // await AuthService.resetPassword(email, code, newPassword)
      setSuccess('Password reset successfully! Redirecting to login...')
      setTimeout(onBackToLogin, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
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
        <h1 style={{ margin: '0 0 8px 0', color: '#0078d4' }}>Reset Password</h1>
        <p style={{ margin: 0, color: '#666' }}>Recover your account</p>
      </div>

      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
      {success && <MessageBar messageBarType={MessageBarType.success}>{success}</MessageBar>}

      {step === 'email' && (
        <form onSubmit={handleRequestReset}>
          <Stack tokens={{ childrenGap: 12 }}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(_, value) => setEmail(value || '')}
              placeholder="your@email.com"
              disabled={loading}
            />
            <PrimaryButton
              text={loading ? 'Sending...' : 'Send Reset Code'}
              onClick={handleRequestReset}
              disabled={loading || !email}
              type="submit"
            />
            <DefaultButton
              text="Back to Login"
              onClick={onBackToLogin}
              disabled={loading}
            />
          </Stack>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleVerifyCode}>
          <Stack tokens={{ childrenGap: 12 }}>
            <TextField
              label="Reset Code"
              value={code}
              onChange={(_, value) => setCode(value || '')}
              placeholder="Enter code from your email"
              disabled={loading}
            />
            <PrimaryButton
              text={loading ? 'Verifying...' : 'Verify Code'}
              onClick={handleVerifyCode}
              disabled={loading || !code}
              type="submit"
            />
            <DefaultButton
              text="Back"
              onClick={() => setStep('email')}
              disabled={loading}
            />
          </Stack>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword}>
          <Stack tokens={{ childrenGap: 12 }}>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(_, value) => setNewPassword(value || '')}
              placeholder="Enter new password"
              disabled={loading}
              canRevealPassword
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(_, value) => setConfirmPassword(value || '')}
              placeholder="Re-enter password"
              disabled={loading}
            />
            <PrimaryButton
              text={loading ? 'Resetting...' : 'Reset Password'}
              onClick={handleResetPassword}
              disabled={loading || !newPassword || !confirmPassword}
              type="submit"
            />
          </Stack>
        </form>
      )}

      {loading && <Spinner label="Processing..." />}
    </Stack>
  )
}

export default ForgotPassword
