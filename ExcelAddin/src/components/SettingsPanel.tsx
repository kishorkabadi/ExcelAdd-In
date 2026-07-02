import React, { useState } from 'react'
import {
  Panel,
  PanelType,
  Stack,
  TextField,
  Toggle,
  Dropdown,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
} from '@fluentui/react'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  onSave: (settings: AppSettings) => void
}

export interface AppSettings {
  apiUrl: string
  autoSync: boolean
  refreshInterval: number
  theme: 'light' | 'dark'
  notifications: boolean
  exportFormat: 'json' | 'csv' | 'xlsx'
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState<AppSettings>({
    apiUrl: localStorage.getItem('apiUrl') || 'https://localhost:7001',
    autoSync: localStorage.getItem('autoSync') === 'true',
    refreshInterval: parseInt(localStorage.getItem('refreshInterval') || '300', 10),
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    notifications: localStorage.getItem('notifications') !== 'false',
    exportFormat: (localStorage.getItem('exportFormat') as any) || 'json',
  })
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = () => {
    onSave(settings)
    localStorage.setItem('apiUrl', settings.apiUrl)
    localStorage.setItem('autoSync', settings.autoSync.toString())
    localStorage.setItem('refreshInterval', settings.refreshInterval.toString())
    localStorage.setItem('theme', settings.theme)
    localStorage.setItem('notifications', settings.notifications.toString())
    localStorage.setItem('exportFormat', settings.exportFormat)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onClose}
      headerText="Settings"
      type={PanelType.medium}
      closeButtonAriaLabel="Close"
    >
      <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: '16px 0' } }}>
        {saveSuccess && (
          <MessageBar messageBarType={MessageBarType.success}>
            Settings saved successfully
          </MessageBar>
        )}

        <TextField
          label="API URL"
          value={settings.apiUrl}
          onChange={(_, value) => setSettings({ ...settings, apiUrl: value || '' })}
          description="Base URL for API calls"
        />

        <Toggle
          label="Auto Sync"
          checked={settings.autoSync}
          onChange={(_, checked) => setSettings({ ...settings, autoSync: checked || false })}
          inlineLabel
        />

        <TextField
          label="Refresh Interval (seconds)"
          type="number"
          value={settings.refreshInterval.toString()}
          onChange={(_, value) =>
            setSettings({ ...settings, refreshInterval: parseInt(value || '300', 10) })
          }
          min="10"
          max="3600"
        />

        <Dropdown
          label="Theme"
          selectedKey={settings.theme}
          onChange={(_, option) =>
            setSettings({ ...settings, theme: (option?.key as 'light' | 'dark') || 'light' })
          }
          options={[
            { key: 'light', text: 'Light' },
            { key: 'dark', text: 'Dark' },
          ]}
        />

        <Toggle
          label="Enable Notifications"
          checked={settings.notifications}
          onChange={(_, checked) => setSettings({ ...settings, notifications: checked || false })}
          inlineLabel
        />

        <Dropdown
          label="Export Format"
          selectedKey={settings.exportFormat}
          onChange={(_, option) =>
            setSettings({ ...settings, exportFormat: (option?.key as any) || 'json' })
          }
          options={[
            { key: 'json', text: 'JSON' },
            { key: 'csv', text: 'CSV' },
            { key: 'xlsx', text: 'Excel' },
          ]}
        />

        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <PrimaryButton text="Save" onClick={handleSave} />
          <DefaultButton text="Cancel" onClick={onClose} />
        </Stack>
      </Stack>
    </Panel>
  )
}

export default SettingsPanel
