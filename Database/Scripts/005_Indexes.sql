-- Add indexes for performance optimization

-- Index for audit log queries by date range
CREATE NONCLUSTERED INDEX [IX_AuditLog_EntityType_CreatedAt]
    ON [dbo].[AuditLog] ([EntityType], [CreatedAt])
    INCLUDE ([UserId], [Action]);

-- Index for data items filtered by user and date
CREATE NONCLUSTERED INDEX [IX_DataItems_UserId_CreatedAt]
    ON [dbo].[DataItems] ([UserId], [CreatedAt])
    INCLUDE ([Name], [Value]);

-- Index for users active status
CREATE NONCLUSTERED INDEX [IX_Users_IsActive]
    ON [dbo].[Users] ([IsActive])
    INCLUDE ([Username], [Email]);

-- Index for refresh tokens search
CREATE NONCLUSTERED INDEX [IX_RefreshTokens_Token_IsRevoked]
    ON [dbo].[RefreshTokens] ([Token], [IsRevoked])
    INCLUDE ([UserId], [ExpiryDate]);
