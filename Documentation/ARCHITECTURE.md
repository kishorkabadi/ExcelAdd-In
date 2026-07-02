# Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Excel Add-in Frontend                     │
│  (React + TypeScript + Office JavaScript API)                 │
└────────────────┬────────────────────────────────────┬─────────┘
                 │                                    │
                 │ HTTP/HTTPS (JSON)                 │
                 │                                    │
        ┌────────▼─────────────────────────────────┐ │
        │  Integration Layer (Sync Services)      │ │
        │  - SyncService                          │ │
        │  - ConflictResolver                     │ │
        │  - OfflineQueue                         │ │
        │  - DataOrchestrator                     │ │
        └────────────────────────────────────────┘ │
                 │                                  │
        ┌────────▼──────────────────────────────┐  │
        │  ASP.NET Core Backend API             │  │
        │  - Controllers                        │  │
        │  - Services                           │  │
        │  - Authentication (JWT)               │  │
        │  - Authorization                      │  │
        │  - Error Handling Middleware          │  │
        └────────┬───────────────────────────────┘  │
                 │                                   │
        ┌────────▼──────────────────────────────┐   │
        │  Entity Framework Core                │   │
        │  - Data Models                        │   │
        │  - DbContext                          │   │
        │  - Migrations                         │   │
        └────────┬───────────────────────────────┘   │
                 │                                   │
        ┌────────▼──────────────────────────────┐   │
        │  SQL Server Database                  │   │
        │  - Users Table                        │   │
        │  - DataItems Table                    │   │
        │  - RefreshTokens Table                │   │
        │  - AuditLog Table                     │   │
        │  - Indexes & Stored Procedures        │   │
        └────────────────────────────────────────┘   │
                                                     │
        ┌────────────────────────────────────────┐   │
        │  Excel Application (Office.onload)    │◄──┘
        │  - Ribbon UI                          │
        │  - Task Pane                          │
        │  - Worksheet Operations               │
        └────────────────────────────────────────┘
```

## Component Architecture

### Frontend (Excel Add-in)

#### Layers

1. **UI Layer** (`components/`)
   - React components using Fluent UI
   - Task pane interface
   - Ribbon commands
   - Status indicators

2. **Business Logic Layer** (`services/`)
   - Excel operations (read/write/format)
   - Authentication
   - Data validation

3. **Integration Layer** (`integration/`)
   - Sync services
   - Conflict resolution
   - Offline support
   - Data orchestration

4. **Storage Layer** (`utils/`)
   - localStorage for offline queue
   - Session storage for temporary data
   - Cache management

### Backend (ASP.NET Core)

#### Layers

1. **API Layer** (`Controllers/`)
   - HTTP endpoints
   - Request validation
   - Response formatting
   - Authorization checks

2. **Service Layer** (`Services/`)
   - Business logic
   - Data transformation
   - Authentication/Authorization
   - External integrations

3. **Data Access Layer** (`Data/`)
   - Entity Framework Core
   - Database queries
   - Migration management
   - Context configuration

4. **Middleware** (`Middleware/`)
   - Error handling
   - Logging
   - Authentication
   - CORS handling

### Database

#### Schema

- **Users**: User accounts and authentication
- **DataItems**: User data with FK to Users
- **RefreshTokens**: JWT refresh tokens with FK to Users
- **AuditLog**: Data modification audit trail

#### Indexes

- Composite indexes on frequently joined columns
- Covering indexes for common queries
- Filtered indexes for status columns

## Data Flow

### Read Operation

```
Excel UI
   ↓
ExcelService.readWorksheet()
   ↓
Office JavaScript API
   ↓
Excel Application
   ↓
Return Data
```

### Sync Operation

```
Excel Frontend
   ↓
SyncService.bidirectionalSync()
   ↓
1. ExcelService.readData() [Local]
   ↓
2. SyncService.pushData() [Upload]
   ↓
ASP.NET Backend
   ├─ Validate input
   ├─ Check authorization
   ├─ Update database
   └─ Return success/error
   ↓
3. SyncService.pullData() [Download]
   ↓
4. ConflictResolver.merge() [If needed]
   ↓
5. ExcelService.writeData() [Local]
   ↓
Excel UI
```

## Authentication & Authorization

### Flow

1. **Login**
   - User enters credentials
   - Backend validates against Users table
   - Generate JWT access token (1 hour expiry)
   - Generate refresh token (7 days expiry)
   - Store tokens in IndexedDB

2. **API Requests**
   - Include JWT in Authorization header
   - Middleware validates token signature
   - Extract user claims
   - Check permissions

3. **Token Refresh**
   - Check if access token expired
   - Submit refresh token
   - Get new access token
   - Update stored tokens

4. **Logout**
   - Revoke refresh token in database
   - Clear tokens from storage
   - Redirect to login

## Error Handling

### Frontend

- Try-catch blocks around async operations
- User notifications for all errors
- Automatic retry for network errors
- Queue offline operations

### Backend

- Centralized error handling middleware
- Structured error responses
- Detailed logging
- Appropriate HTTP status codes

## Performance Optimization

### Frontend

- Lazy loading of components
- Virtualization for large lists
- Caching of API responses
- Debouncing of search/filter

### Backend

- Database query optimization
- Pagination of large datasets
- Response compression
- Connection pooling

### Database

- Proper indexing
- Query optimization
- Statistics maintenance
- Archive old audit logs

## Security

### Frontend

- No sensitive data in localStorage (except tokens)
- CSP headers
- XSS protection
- CSRF tokens for state-changing operations

### Backend

- Input validation and sanitization
- SQL injection prevention (Entity Framework)
- Rate limiting
- HTTPS only
- Secure password hashing (BCrypt)

### Database

- Row-level security (for multi-tenant)
- Encrypted connections
- Backup encryption
- Audit logging

## Scalability Considerations

### Horizontal Scaling

- Stateless API servers
- Load balancer in front
- Distributed cache (Redis)
- Session state in database

### Vertical Scaling

- Database optimization
- Connection pooling
- Query caching
- Archive strategy

## Disaster Recovery

- Daily backups to Azure
- Transaction logs every 15 minutes
- RTO: 1 hour
- RPO: 15 minutes
- Tested recovery quarterly

## Monitoring & Observability

- Application Insights
- Custom logging
- Performance counters
- User session tracking
- Error rate alerts
