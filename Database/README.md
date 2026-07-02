# Database Setup

## Prerequisites

- SQL Server 2019 or later
- SQL Server Management Studio (optional)

## Initial Setup

### Option 1: Using Entity Framework Core Migrations

```bash
cd ExcelApi
dotnet ef database update
```

### Option 2: Manual SQL Scripts

Execute the following scripts in SQL Server Management Studio in order:

1. `001_InitialSchema.sql` - Create database tables
2. `002_SeedData.sql` - Insert seed data
3. `003_StoredProcedures.sql` - Create stored procedures
4. `004_Views.sql` - Create database views
5. `005_Indexes.sql` - Create additional indexes
6. `006_Maintenance.sql` - Create maintenance procedures

## Database Schema

### Users Table
- Stores user account information
- Username and Email are unique
- Password is stored as BCrypt hash

### DataItems Table
- Stores user data items
- Foreign key to Users table
- Cascading delete when user is deleted

### RefreshTokens Table
- Stores JWT refresh tokens
- Tracks token expiration and revocation status

### AuditLog Table
- Logs all data modifications
- Useful for compliance and debugging

## Connection String

Update `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=ExcelEnterpriseDb;Trusted_Connection=true;TrustServerCertificate=true;"
}
```

## Seed Data

Default test users (password: `password123`):

- Username: `admin` | Email: `admin@example.com`
- Username: `testuser` | Email: `test@example.com`
- Username: `demo` | Email: `demo@example.com`

## Backup and Maintenance

### Backup Database
```sql
EXEC sp_BackupDatabase @BackupPath = 'C:\\SQLBackups\\'
```

### Cleanup Old Audit Logs
```sql
EXEC sp_CleanupOldAuditLogs @DaysToKeep = 90
```

### Cleanup Expired Tokens
```sql
EXEC sp_CleanupExpiredTokens
```

## Performance Tuning

- Indexes are created on frequently queried columns
- Consider partitioning AuditLog table for large datasets
- Regular index maintenance is recommended

## Security

- Enable SQL Server encryption
- Use strong connection credentials
- Regularly backup critical data
- Monitor and log database access
