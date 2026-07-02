import { useState, useEffect } from 'react'
import { PrimaryButton, TextField, Stack, Label, Toggle } from '@fluentui/react'

interface AppSettings {
  apiUrl: string
  autoSync: boolean
  theme: 'light' | 'dark'
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    apiUrl: localStorage.getItem('apiUrl') || 'https://localhost:7001',
    autoSync: localStorage.getItem('autoSync') === 'true',
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  })

  const saveSettings = () => {
    localStorage.setItem('apiUrl', settings.apiUrl)
    localStorage.setItem('autoSync', settings.autoSync.toString())
    localStorage.setItem('theme', settings.theme)
  }

  return (
    <Stack tokens={{ childrenGap: 16 }}>
      <TextField
        label="API URL"
        value={settings.apiUrl}
        onChange={(_, value) => setSettings({ ...settings, apiUrl: value || '' })}
      />

      <Toggle
        label="Auto Sync"
        checked={settings.autoSync}
        onChange={(_, checked) => setSettings({ ...settings, autoSync: checked || false })}
      />

      <div>
        <Label>Theme</Label>
        <select
          value={settings.theme}
          onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <PrimaryButton text="Save Settings" onClick={saveSettings} />
    </Stack>
  )
}

export default Settings
