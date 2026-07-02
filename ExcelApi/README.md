# Excel Enterprise API

ASP.NET Core 8 backend for Excel Enterprise Add-in

## Setup

### Prerequisites
- .NET 8 SDK
- SQL Server 2019+

### Configuration

1. Update `appsettings.json` with your database connection string
2. Update JWT secret key

### Database Migration

```bash
dotnet ef database update
```

### Build

```bash
dotnet build
```

### Run

```bash
dotnet run
```

API will be available at `https://localhost:7001`
Swagger UI: `https://localhost:7001/swagger`

## API Endpoints

### Auth
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register
- POST `/api/auth/refresh` - Refresh token
- POST `/api/auth/logout` - Logout

### Data
- GET `/api/data` - Get all items
- GET `/api/data/{id}` - Get item by ID
- POST `/api/data` - Create item
- PUT `/api/data/{id}` - Update item
- DELETE `/api/data/{id}` - Delete item

### User
- GET `/api/user/profile` - Get user profile
- PUT `/api/user/profile` - Update profile
- POST `/api/user/change-password` - Change password
