# Part 7: Integration Layer

This part contains the integration layer that connects the Excel Add-in frontend with the ASP.NET Core backend API.

## Key Features

### 1. Sync Service (`SyncService.ts`)
- Handles all data synchronization with the server
- Implements request/response interceptors for authentication
- Automatic token refresh on 401 errors
- Supports file upload/download

### 2. Sync Hooks

#### `useDataSync.ts`
- Pull data from server
- Push data to server
- Bidirectional synchronization
- Progress tracking

#### `useAutoSync.ts`
- Automatic periodic synchronization
- Configurable interval and direction

#### `useNetworkStatus.ts`
- Detects online/offline status
- Useful for offline mode handling

### 3. Conflict Resolution (`ConflictResolver.ts`)
Handles data conflicts during synchronization:
- **server-wins**: Server data always takes precedence
- **local-wins**: Local data always takes precedence
- **merge**: Intelligently merges based on timestamps
- **prompt**: User decides the resolution

### 4. Offline Queue (`OfflineQueue.ts`)
Queues operations when offline:
- Persists to localStorage
- Automatic retry with configurable max retries
- Syncs when connection is restored

### 5. Data Sync Provider (`DataSyncProvider.tsx`)
React context provider for global sync state:
- Auto-sync configuration
- Progress indication
- Error handling
- Last sync timestamp

### 6. Sync Status Component (`SyncStatus.tsx`)
UI component showing:
- Sync progress
- Pending queue items
- Last sync time
- Manual sync buttons

### 7. Data Orchestrator (`DataOrchestrator.ts`)
Coordinates complete sync workflow:
- Data transformation
- Validation
- Formatting
- Server synchronization

## Usage Examples

### Basic Synchronization
```typescript
const { bidirectionalSync, isSyncing } = useDataSync()

const handleSync = async () => {
  await bidirectionalSync()
}
```

### Auto Sync with Configuration
```typescript
const config = {
  interval: 5 * 60 * 1000, // 5 minutes
  enabled: true,
  direction: 'bidirectional' as const,
}

const { lastSync, error } = useAutoSync(config)
```

### Conflict Resolution
```typescript
const { handleConflict } = useConflictResolution()

const conflicts = ConflictResolver.detectConflicts(localData, serverData)
if (conflicts.length > 0) {
  const resolved = await handleConflict(conflicts, 'merge')
}
```

### Offline Queue
```typescript
const { queue, addToQueue, removeFromQueue } = useOfflineQueue()

// Add operation to queue
addToQueue('create', { name: 'New Item', value: 100 })

// Later, when online
await SyncService.pushData(queue.map(q => q.data))
```

## Architecture Flow

```
Excel Frontend
    ↓
DataSyncProvider
    ↓
SyncService
    ↓
ConflictResolver / OfflineQueue
    ↓
ASP.NET Core Backend
    ↓
SQL Server Database
```

## Configuration

Set in `appsettings` or environment:
- `ApiUrl`: Backend API URL
- `AutoSync`: Enable automatic synchronization
- `SyncInterval`: Milliseconds between auto-syncs
- `ConflictStrategy`: How to resolve conflicts

## Error Handling

All sync operations include:
- Network error handling
- Retry logic
- User notifications
- Detailed logging

## Security

- JWT token management
- Automatic token refresh
- Request/response encryption support
- User isolation (data scoped to user ID)
