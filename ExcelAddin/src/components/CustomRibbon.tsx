import React from 'react'
import { CommandBar, ICommandBarItemProps } from '@fluentui/react'
import { SyncIcon, SettingsIcon, ShareIcon, DeleteIcon } from '@fluentui/react-icons'

interface CustomRibbonProps {
  onSync: () => void
  onSettings: () => void
  onShare: () => void
  onDelete: () => void
  isLoading?: boolean
}

const CustomRibbon: React.FC<CustomRibbonProps> = ({
  onSync,
  onSettings,
  onShare,
  onDelete,
  isLoading = false,
}) => {
  const items: ICommandBarItemProps[] = [
    {
      key: 'sync',
      text: 'Sync Data',
      iconProps: { iconName: 'Sync' },
      onClick: onSync,
      disabled: isLoading,
      tooltip: 'Synchronize data with the server',
    },
    {
      key: 'divider1',
      text: '',
      itemType: 1, // Divider
    },
    {
      key: 'share',
      text: 'Share',
      iconProps: { iconName: 'Share' },
      onClick: onShare,
      disabled: isLoading,
      tooltip: 'Share workbook with team members',
    },
    {
      key: 'divider2',
      text: '',
      itemType: 1, // Divider
    },
    {
      key: 'settings',
      text: 'Settings',
      iconProps: { iconName: 'Settings' },
      onClick: onSettings,
      disabled: isLoading,
      tooltip: 'Configure application settings',
    },
  ]

  const farItems: ICommandBarItemProps[] = [
    {
      key: 'delete',
      text: 'Delete',
      iconProps: { iconName: 'Delete' },
      onClick: onDelete,
      disabled: isLoading,
      tooltip: 'Delete selected items',
    },
  ]

  return (
    <CommandBar
      items={items}
      farItems={farItems}
      styles={{
        root: {
          backgroundColor: '#f3f2f1',
          borderBottom: '1px solid #e1dfdd',
          padding: '4px 16px',
        },
      }}
    />
  )
}

export default CustomRibbon
