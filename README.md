# Excel Enterprise Add-in

A comprehensive enterprise-grade Excel Add-in built with Office.js, React, TypeScript, and ASP.NET Core 8.

## Project Structure

```
ExcelEnterpriseAddin/
├── ExcelAddin/                    # Office Add-in (React + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── styles/
│   │   └── App.tsx
│   ├── manifest.xml
│   ├── package.json
│   └── tsconfig.json
│
├── ExcelApi/                      # ASP.NET Core Backend
│   ├── Controllers/
│   ├── Services/
│   ├── Models/
│   ├── Data/
│   ├── DTOs/
│   ├── Middleware/
│   ├── ExcelApi.csproj
│   └── Program.cs
│
├── Database/                      # SQL Server & Migrations
│   ├── Scripts/
│   ├── Migrations/
│   └── SeedData/
│
└── .gitignore
```

## Features

### Excel Add-in
- ✅ Custom Ribbon
- ✅ Task Pane
- ✅ Authentication (Login/Logout)
- ✅ Read/Write Workbook
- ✅ Table Management (CRUD)
- ✅ Formatting & Charts
- ✅ Named Ranges
- ✅ Data Sync with API
- ✅ Progress Tracking
- ✅ Settings Management

### Backend API
- ✅ JWT Authentication
- ✅ Refresh Token Support
- ✅ CRUD Operations
- ✅ SQL Server Integration
- ✅ Entity Framework Core
- ✅ Swagger Documentation
- ✅ Centralized Logging
- ✅ Repository Pattern

## Setup Instructions

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- SQL Server 2019+
- Visual Studio Code or Visual Studio 2022

### Excel Add-in Setup
```bash
cd ExcelAddin
npm install
npm start
```

### Backend Setup
```bash
cd ExcelApi
dotnet restore
dotnet build
dotnet run
```

## Build & Deployment

See `BUILDING.md` for detailed build instructions and `DEPLOYMENT.md` for production deployment.

## Development Status

- [x] Part 1: Solution Setup
- [x] Part 2: UI Components
- [x] Part 3: Authentication
- [x] Part 4: Excel APIs
- [x] Part 5: Backend APIs
- [x] Part 6: Database
- [x] Part 7: Integration
- [x] Part 8: Deployment

## License

MIT
