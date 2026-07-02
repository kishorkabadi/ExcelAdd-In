import { useState } from 'react'
import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react'
import DataManager from './DataManager'
import Settings from './Settings'

interface TaskPaneProps {
  onLogout: () => void
}

const TaskPane: React.FC<TaskPaneProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'data' | 'settings'>('home')

  return (
    <Stack className="taskpane-container" styles={{ root: { padding: 16 } }}>
      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton
          text="Home"
          onClick={() => setActiveTab('home')}
          disabled={activeTab === 'home'}
        />
        <PrimaryButton
          text="Data Manager"
          onClick={() => setActiveTab('data')}
          disabled={activeTab === 'data'}
        />
        <PrimaryButton
          text="Settings"
          onClick={() => setActiveTab('settings')}
          disabled={activeTab === 'settings'}
        />
        <DefaultButton text="Logout" onClick={onLogout} />
      </Stack>

      <div className="mt-4">
        {activeTab === 'home' && <div>Welcome to Excel Enterprise Add-in</div>}
        {activeTab === 'data' && <DataManager />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </Stack>
  )
}

export default TaskPane
