-- Backup and Recovery Procedures

-- Create stored procedure for database backup
CREATE PROCEDURE [dbo].[sp_BackupDatabase]
    @BackupPath NVARCHAR(500) = 'C:\\SQLBackups\\'
AS
BEGIN
    DECLARE @BackupFile NVARCHAR(500)
    SET @BackupFile = @BackupPath + 'ExcelEnterpriseDb_' + FORMAT(GETUTCDATE(), 'yyyyMMdd_HHmmss') + '.bak'
    
    BACKUP DATABASE [ExcelEnterpriseDb]
    TO DISK = @BackupFile
    WITH FORMAT, MEDIANAME = 'Excel Database Backup';
    
    PRINT 'Backup completed to: ' + @BackupFile;
END;

-- Create stored procedure for cleanup old audit logs
CREATE PROCEDURE [dbo].[sp_CleanupOldAuditLogs]
    @DaysToKeep INT = 90
AS
BEGIN
    DELETE FROM [dbo].[AuditLog]
    WHERE [CreatedAt] < DATEADD(DAY, -@DaysToKeep, GETUTCDATE());
    
    PRINT 'Old audit logs cleaned up.';
END;

-- Create stored procedure for cleanup expired refresh tokens
CREATE PROCEDURE [dbo].[sp_CleanupExpiredTokens]
AS
BEGIN
    DELETE FROM [dbo].[RefreshTokens]
    WHERE [ExpiryDate] < GETUTCDATE() AND [IsRevoked] = 1;
    
    PRINT 'Expired tokens cleaned up.';
END;
