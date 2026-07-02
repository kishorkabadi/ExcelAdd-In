# Deployment Guide

## Prerequisites

### Backend (ASP.NET Core)
- .NET 8 SDK
- SQL Server 2019+
- IIS (for Windows Server)

### Frontend (Excel Add-in)
- Office 365 or Excel 2021+
- Windows 10+ or macOS 12+
- .NET Framework 4.7.2+ (Windows only)

## Backend Deployment

### Step 1: Prepare Database

```bash
# Navigate to project
cd ExcelApi

# Update connection string in appsettings.json
# Create/update database
dotnet ef database update
```

### Step 2: Build Application

```bash
# Publish for production
dotnet publish -c Release -o ./publish
```

### Step 3: Deploy to Server

#### Option A: IIS (Windows Server)

1. Install IIS with ASP.NET Core Hosting Bundle
2. Create application pool (.NET CLR version: No Managed Code)
3. Create website in IIS pointing to publish folder
4. Configure SSL certificate
5. Configure application pool settings

#### Option B: Docker

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY ./publish .
EXPOSE 80 443
ENTRYPOINT ["dotnet", "ExcelApi.dll"]
```

### Step 4: Configure Environment

Update `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_PROD_SERVER;Database=ExcelEnterpriseDb;User Id=sa;Password=YOUR_PASSWORD;"
  },
  "JwtSettings": {
    "Secret": "YOUR_PRODUCTION_SECRET_KEY_MIN_64_CHARS",
    "ExpiryMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### Step 5: Security Configuration

1. **Enable HTTPS**
   - Install SSL certificate
   - Configure HTTPS binding
   - Redirect HTTP to HTTPS

2. **Database Security**
   - Use strong passwords
   - Enable encryption at rest
   - Regular backups
   - Implement row-level security

3. **API Security**
   - Enable CORS selectively
   - Rate limiting
   - Request validation
   - DDOS protection

## Frontend Deployment

### Step 1: Build Add-in

```bash
cd ExcelAddin

# Update API URL in environment config
# Build for production
npm run build:prod
```

### Step 2: Create Manifest

Update `manifest.xml`:

```xml
<OfficeApp>
  <Id>12345678-1234-1234-1234-123456789012</Id>
  <Version>1.0.0.0</Version>
  <ProviderName>Excel Enterprise</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue="Excel Enterprise"/>
  <Description DefaultValue="Professional Excel data management"/>
  <Hosts>
    <Host Name="Workbook"/>
  </Hosts>
  <DefaultSettings>
    <SourceLocation DefaultValue="https://your-domain.com/taskpane.html"/>
  </DefaultSettings>
  <Permissions>ReadWriteDocument</Permissions>
</OfficeApp>
```

### Step 3: Publish to AppSource

1. Create Azure Storage account
2. Upload add-in files
3. Generate manifest URL
4. Submit to Microsoft AppSource
5. Wait for approval

### Step 4: Alternative: Deploy to Internal Catalog

1. Upload manifest to SharePoint
2. Configure in Office Admin Center
3. Users can install from Organizational Add-ins

## Monitoring

### Backend Monitoring

```bash
# Check application health
GET https://your-domain.com/api/health

# View logs
# Windows: Event Viewer
# Linux: journalctl -u excel-api
```

### Performance Monitoring
- Set up Application Insights
- Monitor CPU, Memory, Disk
- Database query performance
- API response times

### Alerts
- Set up email alerts for:
  - High error rates
  - Database connection issues
  - Server down
  - High memory usage

## Maintenance

### Regular Tasks

**Weekly**
- Review error logs
- Monitor performance metrics
- Check disk space

**Monthly**
- Database maintenance
- Backup verification
- Security patch updates

**Quarterly**
- Full system audit
- Capacity planning
- Disaster recovery testing

## Rollback Procedures

If issues occur after deployment:

1. Disable auto-sync in clients
2. Revert to previous version
3. Investigate root cause
4. Fix and test
5. Redeploy

## Support Contacts

- DevOps: devops@example.com
- DBA: dba@example.com
- Security: security@example.com
