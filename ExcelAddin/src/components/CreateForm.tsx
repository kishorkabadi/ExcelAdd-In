import React, { useState } from 'react'
import { Stack, TextField, PrimaryButton, DefaultButton, MessageBar, MessageBarType, Spinner } from '@fluentui/react'
import { ApiService } from '../services/ApiService'

interface CreateFormProps {
  onCreated: () => void
}

const CreateForm: React.FC<CreateFormProps> = ({ onCreated }) => {
  const [name, setName] = useState('')
  const [value, setValue] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await ApiService.createData({ name, value })
      setName('')
      setValue(0)
      setSuccess(true)
      onCreated()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to create item')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
      {success && <MessageBar messageBarType={MessageBarType.success}>Item created successfully</MessageBar>}

      <TextField
        label="Name"
        value={name}
        onChange={(_, val) => setName(val || '')}
        placeholder="Enter item name"
      />

      <TextField
        label="Value"
        type="number"
        value={value.toString()}
        onChange={(_, val) => setValue(parseInt(val || '0', 10))}
      />

      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton text="Create" onClick={handleSubmit} disabled={loading} />
        <DefaultButton text="Reset" onClick={() => { setName(''); setValue(0) }} disabled={loading} />
      </Stack>

      {loading && <Spinner label="Creating item..." />}
    </Stack>
  )
}

export default CreateForm
