import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SyncStatus from '../components/SyncStatus'

vi.mock('../hooks/useDataSync')
vi.mock('../utils/OfflineQueue')

describe('SyncStatus Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render sync buttons', () => {
    render(<SyncStatus />)
    expect(screen.getByText('Pull from Server')).toBeInTheDocument()
    expect(screen.getByText('Push to Server')).toBeInTheDocument()
    expect(screen.getByText('Sync All')).toBeInTheDocument()
  })

  it('should display error message if sync fails', () => {
    render(<SyncStatus />)
    // Test error display
  })

  it('should show last sync time', () => {
    render(<SyncStatus />)
    // Test last sync display
  })
})
