import React, { useState } from 'react'
import { Pivot, PivotItem, Stack } from '@fluentui/react'
import DataTable from './DataTable'
import CreateForm from './CreateForm'
import EditForm from './EditForm'

const DataManager: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [editItem, setEditItem] = useState<{ id: string; name: string; value: number } | null>(null)

  const handleItemCreated = () => {
    setRefreshKey((k) => k + 1)
  }

  const handleItemSaved = () => {
    setRefreshKey((k) => k + 1)
    setEditItem(null)
  }

  return (
    <Stack tokens={{ childrenGap: 16 }}>
      <Pivot>
        <PivotItem headerText="Data" itemKey="data">
          <DataTable key={refreshKey} />
        </PivotItem>
        <PivotItem headerText="Create New" itemKey="create">
          <CreateForm onCreated={handleItemCreated} />
        </PivotItem>
        {editItem && (
          <PivotItem headerText="Edit" itemKey="edit">
            <EditForm
              itemId={editItem.id}
              initialName={editItem.name}
              initialValue={editItem.value}
              onSaved={handleItemSaved}
              onCancel={() => setEditItem(null)}
            />
          </PivotItem>
        )}
      </Pivot>
    </Stack>
  )
}

export default DataManager
