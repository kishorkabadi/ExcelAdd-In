import React, { useState } from 'react'
import {
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  Stack,
  TextField,
  Dropdown,
  IDropdownOption,
} from '@fluentui/react'

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  onShare: (emails: string[], permission: 'view' | 'edit') => void
}

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, onShare }) => {
  const [emails, setEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [permission, setPermission] = useState<'view' | 'edit'>('view')

  const handleAddEmail = () => {
    if (emailInput && emailInput.includes('@')) {
      setEmails([...emails, emailInput])
      setEmailInput('')
    }
  }

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const handleShare = () => {
    onShare(emails, permission)
    setEmails([])
    setEmailInput('')
    setPermission('view')
    onClose()
  }

  const permissionOptions: IDropdownOption[] = [
    { key: 'view', text: 'View Only' },
    { key: 'edit', text: 'Can Edit' },
  ]

  return (
    <Dialog
      hidden={!isOpen}
      onDismiss={onClose}
      dialogContentProps={{
        type: DialogType.normal,
        title: 'Share Workbook',
        subText: 'Share this workbook with team members',
      }}
      modalProps={{
        isBlocking: false,
        styles: { main: { maxWidth: 450 } },
      }}
    >
      <Stack tokens={{ childrenGap: 12 }}>
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <TextField
            placeholder="Enter email address"
            value={emailInput}
            onChange={(_, value) => setEmailInput(value || '')}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddEmail()
              }
            }}
            styles={{ root: { flex: 1 } }}
          />
          <PrimaryButton text="Add" onClick={handleAddEmail} styles={{ root: { width: 80 } }} />
        </Stack>

        {emails.length > 0 && (
          <div>
            <strong>Sharing with:</strong>
            {emails.map((email, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span>{email}</span>
                <DefaultButton
                  text="Remove"
                  onClick={() => handleRemoveEmail(index)}
                  styles={{ root: { fontSize: 12 } }}
                />
              </div>
            ))}
          </div>
        )}

        <Dropdown
          label="Permission"
          selectedKey={permission}
          onChange={(_, option) => setPermission((option?.key as 'view' | 'edit') || 'view')}
          options={permissionOptions}
        />
      </Stack>

      <DialogFooter>
        <PrimaryButton onClick={handleShare} text="Share" disabled={emails.length === 0} />
        <DefaultButton onClick={onClose} text="Cancel" />
      </DialogFooter>
    </Dialog>
  )
}

export default ShareDialog
