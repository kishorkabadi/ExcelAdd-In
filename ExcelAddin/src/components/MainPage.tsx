import React, { useState, useEffect } from 'react'
import { Stack, Spinner, SpinnerSize, MessageBar, MessageBarType } from '@fluentui/react'
import CustomRibbon from './CustomRibbon'
import DataManager from './DataManager'
import SettingsPanel, { AppSettings } from './SettingsPanel'
import ShareDialog from './ShareDialog'

interface MainPageProps {
  onLogout: () => void
}

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleSync = async () => {
    setSyncLoading(true)
    try {
      // Sync logic will be implemented in Part 5
      setMessage({ text: 'Data synced successfully', type: 'success' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ text: 'Sync failed', type: 'error' })
    } finally {
      setSyncLoading(false)
    }
  }

  const handleSettings = () => {
    setSettingsOpen(true)
  }

  const handleShare = (emails: string[], permission: 'view' | 'edit') => {
    console.log('Sharing with:', emails, 'Permission:', permission)
    setMessage({ text: 'Workbook shared successfully', type: 'success' })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = () => {
    console.log('Delete selected items')
  }

  const handleSaveSettings = (settings: AppSettings) => {
    console.log('Settings saved:', settings)
  }

  return (
    <Stack styles={{ root: { height: '100vh', display: 'flex', flexDirection: 'column' } }}>
      <CustomRibbon
        onSync={handleSync}
        onSettings={handleSettings}
        onShare={() => setShareDialogOpen(true)}
        onDelete={handleDelete}
        isLoading={syncLoading}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {syncLoading && <Spinner size={SpinnerSize.medium} label="Syncing..." />}
        {message && (
          <MessageBar messageBarType={message.type === 'success' ? MessageBarType.success : MessageBarType.error}>
            {message.text}
          </MessageBar>
        )}
        <DataManager />
      </div>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} onSave={handleSaveSettings} />
      <ShareDialog
        isOpen={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        onShare={handleShare}
      />
    </Stack>
  )
}

export default MainPage
