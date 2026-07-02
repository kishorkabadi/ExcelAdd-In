import React, { useState } from 'react'
import { Stack, TextField, PrimaryButton, DefaultButton, MessageBar, MessageBarType, Spinner } from '@fluentui/react'
import { ApiService } from '../services/ApiService'

interface EditFormProps {
  itemId: string
  initialName: string
  initialValue: number
  onSaved: () => void
  onCancel: () => void
}

const EditForm: React.FC<EditFormProps> = ({ itemId, initialName, initialValue, onSaved, onCancel }) => {
  const [name, setName] = useState(initialName)
  const [value, setValue] = useState<number>(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await ApiService.updateData(itemId, { name, value })
      onSaved()
    } catch (err) {
      setError('Failed to update item')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

      <TextField
        label="Name"
        value={name}
        onChange={(_, val) => setName(val || '')}
      />

      <TextField
        label="Value"
        type="number"
        value={value.toString()}
        onChange={(_, val) => setValue(parseInt(val || '0', 10))}
      />

      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton text="Save" onClick={handleSave} disabled={loading} />
        <DefaultButton text="Cancel" onClick={onCancel} disabled={loading} />
      </Stack>

      {loading && <Spinner label="Saving..." />}
    </Stack>
  )
}

export default EditForm
