import React, { useState } from 'react'
import {
  Stack,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Dialog,
  DialogType,
  DialogFooter,
  Text,
} from '@fluentui/react'
import { AuthService } from '../services/AuthService'

interface LogoutConfirmProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

const LogoutConfirm: React.FC<LogoutConfirmProps> = ({ isOpen, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    setLoading(true)
    setError(null)

    try {
      await AuthService.logout()
      onConfirm()
    } catch (err: any) {
      setError(err.message || 'Logout failed')
      setLoading(false)
    }
  }

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={onCancel}
      dialogContentProps={{
        type: DialogType.normal,
        title: 'Confirm Logout',
        subText: 'Are you sure you want to log out?',
      }}
      modalProps={{
        isBlocking: false,
        styles: { main: { maxWidth: 400 } },
      }}
    >
      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

      <Text>Any unsaved changes may be lost.</Text>

      <DialogFooter>
        <PrimaryButton onClick={handleLogout} text="Logout" disabled={loading} />
        <DefaultButton onClick={onCancel} text="Cancel" disabled={loading} />
      </DialogFooter>
    </Dialog>
  )
}

export default LogoutConfirm
