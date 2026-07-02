import React, { useState } from 'react'
import { PrimaryButton, Stack, ProgressIndicator, MessageBar, MessageBarType } from '@fluentui/react'
import { ExcelService } from '../services/ExcelService'

const ExcelIntegration: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleReadWorkbook = async () => {
    setIsLoading(true)
    setProgress(0)
    try {
      setProgress(33)
      const data = await ExcelService.readData()
      setProgress(66)
      console.log('Read data:', data)
      setProgress(100)
      setMessage({ text: 'Data read successfully', type: 'success' })
    } catch (err) {
      setMessage({ text: 'Failed to read data', type: 'error' })
      console.error(err)
    } finally {
      setIsLoading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const handleCreateTable = async () => {
    setIsLoading(true)
    setProgress(0)
    try {
      const sampleData = [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 },
        { name: 'Item 3', value: 300 },
      ]
      setProgress(50)
      await ExcelService.createTable(sampleData, 'SampleTable')
      setProgress(100)
      setMessage({ text: 'Table created successfully', type: 'success' })
    } catch (err) {
      setMessage({ text: 'Failed to create table', type: 'error' })
      console.error(err)
    } finally {
      setIsLoading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  return (
    <Stack tokens={{ childrenGap: 16 }}>
      {message && (
        <MessageBar messageBarType={message.type === 'success' ? MessageBarType.success : MessageBarType.error}>
          {message.text}
        </MessageBar>
      )}

      {progress > 0 && <ProgressIndicator percentComplete={progress / 100} label="Progress..." />
      }

      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton
          text="Read Workbook"
          onClick={handleReadWorkbook}
          disabled={isLoading}
        />
        <PrimaryButton
          text="Create Table"
          onClick={handleCreateTable}
          disabled={isLoading}
        />
      </Stack>
    </Stack>
  )
}

export default ExcelIntegration
