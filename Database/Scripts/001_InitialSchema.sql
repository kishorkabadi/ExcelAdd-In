-- Users Table
CREATE TABLE [dbo].[Users] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Username] NVARCHAR(50) NOT NULL UNIQUE,
    [Email] NVARCHAR(100) NOT NULL UNIQUE,
    [FirstName] NVARCHAR(50) NOT NULL,
    [LastName] NVARCHAR(50) NOT NULL,
    [PasswordHash] NVARCHAR(MAX) NOT NULL,
    [RefreshToken] NVARCHAR(MAX),
    [RefreshTokenExpiryTime] DATETIME2,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2
);

-- Create indexes for Users
CREATE INDEX [IX_Users_Username] ON [dbo].[Users]([Username]);
CREATE INDEX [IX_Users_Email] ON [dbo].[Users]([Email]);

-- DataItems Table
CREATE TABLE [dbo].[DataItems] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(200) NOT NULL,
    [Value] DECIMAL(18, 2) NOT NULL,
    [UserId] INT NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    CONSTRAINT [FK_DataItems_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE
);

-- Create indexes for DataItems
CREATE INDEX [IX_DataItems_UserId] ON [dbo].[DataItems]([UserId]);
CREATE INDEX [IX_DataItems_CreatedAt] ON [dbo].[DataItems]([CreatedAt]);

-- RefreshTokens Table
CREATE TABLE [dbo].[RefreshTokens] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,
    [Token] NVARCHAR(MAX) NOT NULL,
    [ExpiryDate] DATETIME2 NOT NULL,
    [IsRevoked] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_RefreshTokens_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE
);

-- Create indexes for RefreshTokens
CREATE INDEX [IX_RefreshTokens_UserId] ON [dbo].[RefreshTokens]([UserId]);
CREATE INDEX [IX_RefreshTokens_Token] ON [dbo].[RefreshTokens]([Token]);

-- AuditLog Table
CREATE TABLE [dbo].[AuditLog] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT,
    [Action] NVARCHAR(100) NOT NULL,
    [EntityType] NVARCHAR(100),
    [EntityId] INT,
    [Changes] NVARCHAR(MAX),
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_AuditLog_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([Id]) ON DELETE SET NULL
);

-- Create indexes for AuditLog
CREATE INDEX [IX_AuditLog_UserId] ON [dbo].[AuditLog]([UserId]);
CREATE INDEX [IX_AuditLog_CreatedAt] ON [dbo].[AuditLog]([CreatedAt]);
