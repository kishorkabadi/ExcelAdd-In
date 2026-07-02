# User Guide

## Getting Started

### Installation

1. **Download and Install**
   - Download the Excel Add-in from Microsoft AppSource
   - Open Excel and enable the add-in

2. **Configure Server Connection**
   - Open Add-in Settings
   - Enter API URL (e.g., `https://api.example.com`)
   - Click Save

### First Login

1. Click the "Login" button in the add-in
2. Enter your credentials
3. Click "Login"
4. Grant permission if prompted

## Features

### Data Management

#### View Data
- Click "View Data" to see all your data items
- Data is displayed in a table format
- Use search to filter items

#### Create Item
1. Click "Add Item" button
2. Enter name and value
3. Click "Create"
4. Item appears in the list

#### Edit Item
1. Click the item row
2. Click "Edit"
3. Modify name/value
4. Click "Save"

#### Delete Item
1. Click the item row
2. Click "Delete"
3. Confirm deletion

### Synchronization

#### Manual Sync
- **Pull from Server**: Fetch latest data from server
- **Push to Server**: Upload local changes
- **Sync All**: Bidirectional synchronization

#### Auto Sync
1. Go to Settings
2. Enable "Auto Sync"
3. Set interval (default: 5 minutes)
4. Add-in will sync automatically

### File Operations

#### Upload Excel File
1. Click "Import"
2. Select Excel file
3. Choose columns to import
4. Click "Import"

#### Export Data
1. Click "Export"
2. Choose export format
3. Click "Download"

## Settings

### General Settings
- **API URL**: Server connection URL
- **Auto Sync**: Enable/disable automatic synchronization
- **Sync Interval**: Minutes between auto-syncs
- **Conflict Strategy**: How to resolve conflicts

### Display Settings
- **Theme**: Light/Dark mode
- **Language**: Supported languages
- **Number Format**: Decimal places and separators

## Troubleshooting

### Login Issues
- Verify internet connection
- Check username/password
- Reset password if forgotten
- Contact administrator if account locked

### Sync Failures
- Check network connection
- Verify server is running
- Check for pending queue items
- Review error message in notification

### Data Not Appearing
- Refresh the view
- Check filters and search
- Verify user permissions
- Try syncing from server

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Login | Ctrl+Shift+L |
| Sync All | Ctrl+Shift+S |
| Add Item | Ctrl+Shift+N |
| Delete Item | Ctrl+Shift+D |
| Search | Ctrl+F |

## Best Practices

1. **Regular Backups**
   - Export data regularly
   - Keep local copies

2. **Enable Auto Sync**
   - Prevents data loss
   - Keeps data consistent

3. **Use Conflict Resolution**
   - Choose appropriate strategy
   - Review conflicts before merging

4. **Check Pending Queue**
   - Verify offline operations synced
   - Retry failed items

## Support

- Visit: https://support.example.com
- Email: support@example.com
- Phone: 1-800-EXAMPLE
- Live Chat: Available Mon-Fri 9AM-5PM EST
