import { useState } from 'react'
import { PrimaryButton, DefaultButton, TextField, List, Stack, Spinner, SpinnerSize, MessageBar, MessageBarType } from '@fluentui/react'
import { ExcelService } from '../services/ExcelService'
import { ApiService } from '../services/ApiService'

interface DataItem {
  id: string
  name: string
  value: number
}

const DataManager: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newItemName, setNewItemName] = useState('')
  const [newItemValue, setNewItemValue] = useState(0)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await ApiService.getData()
      setData(response.data)
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createItem = async () => {
    if (!newItemName) {
      setError('Please enter a name')
      return
    }

    try {
      const newItem = await ApiService.createData({ name: newItemName, value: newItemValue })
      setData([...data, newItem])
      setNewItemName('')
      setNewItemValue(0)
    } catch (err) {
      setError('Failed to create item')
      console.error(err)
    }
  }

  const syncToExcel = async () => {
    try {
      await ExcelService.writeData(data)
      setError(null)
    } catch (err) {
      setError('Failed to sync to Excel')
      console.error(err)
    }
  }

  return (
    <Stack tokens={{ childrenGap: 16 }}>
      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton text="Load Data" onClick={loadData} disabled={loading} />
        <DefaultButton text="Sync to Excel" onClick={syncToExcel} disabled={data.length === 0} />
      </Stack>

      <Stack tokens={{ childrenGap: 8 }}>
        <TextField
          label="Name"
          value={newItemName}
          onChange={(_, value) => setNewItemName(value || '')}
        />
        <TextField
          label="Value"
          type="number"
          value={newItemValue.toString()}
          onChange={(_, value) => setNewItemValue(parseInt(value || '0', 10))}
        />
        <PrimaryButton text="Create Item" onClick={createItem} />
      </Stack>

      {loading ? (
        <Spinner size={SpinnerSize.medium} label="Loading..." />
      ) : (
        <List
          items={data}
          onRenderCell={(item: DataItem) => (
            <div key={item.id}>
              {item.name}: {item.value}
            </div>
          )}
        />
      )}
    </Stack>
  )
}

export default DataManager
