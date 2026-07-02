import React, { useState, useEffect } from 'react'
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn,
  CommandBar,
  ICommandBarItemProps,
  Stack,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
} from '@fluentui/react'
import { ApiService } from '../services/ApiService'

interface DataItem {
  id: string
  name: string
  value: number
  createdAt: string
  updatedAt: string
}

const DataTable: React.FC = () => {
  const [items, setItems] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<DataItem[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedItems(selection.getSelection() as DataItem[])
    },
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await ApiService.getData()
      setItems(response)
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      for (const item of selectedItems) {
        await ApiService.deleteData(item.id)
      }
      setItems(items.filter((item) => !selectedItems.includes(item)))
      setDeleteDialogOpen(false)
      setSelectedItems([])
    } catch (err) {
      setError('Failed to delete items')
      console.error(err)
    }
  }

  const columns: IColumn[] = [
    {
      key: 'name',
      name: 'Name',
      fieldName: 'name',
      minWidth: 100,
      isResizable: true,
    },
    {
      key: 'value',
      name: 'Value',
      fieldName: 'value',
      minWidth: 100,
      isResizable: true,
    },
    {
      key: 'createdAt',
      name: 'Created',
      fieldName: 'createdAt',
      minWidth: 150,
      isResizable: true,
      onRender: (item: DataItem) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      key: 'updatedAt',
      name: 'Updated',
      fieldName: 'updatedAt',
      minWidth: 150,
      isResizable: true,
      onRender: (item: DataItem) => new Date(item.updatedAt).toLocaleDateString(),
    },
  ]

  const commandItems: ICommandBarItemProps[] = [
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      onClick: loadData,
      disabled: loading,
    },
    {
      key: 'delete',
      text: 'Delete',
      iconProps: { iconName: 'Delete' },
      onClick: () => setDeleteDialogOpen(true),
      disabled: selectedItems.length === 0 || loading,
    },
  ]

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

      <CommandBar items={commandItems} />

      {loading ? (
        <Spinner size={SpinnerSize.large} label="Loading data..." />
      ) : (
        <DetailsList
          items={items}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selection={selection}
          selectionPreservedOnEmptyClick
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          ariaLabelForSelectionColumn="Toggle selection"
          checkButtonAriaLabel="Row checkbox"
          onRenderCheckbox={(props) => {
            return (
              <input
                type="checkbox"
                checked={props?.checked}
                onChange={() => props?.onChange?.(!(props?.checked ?? false))}
              />
            )
          }}
        />
      )}

      <Dialog
        hidden={!deleteDialogOpen}
        onDismiss={() => setDeleteDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Delete Items',
          subText: `Are you sure you want to delete ${selectedItems.length} item(s)?`,
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={handleDelete} text="Delete" />
          <DefaultButton onClick={() => setDeleteDialogOpen(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </Stack>
  )
}

export default DataTable
