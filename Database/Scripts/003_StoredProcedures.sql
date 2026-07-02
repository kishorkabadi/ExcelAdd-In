-- Create stored procedure for getting user data items
CREATE PROCEDURE [dbo].[sp_GetUserDataItems]
    @UserId INT
AS
BEGIN
    SELECT [Id], [Name], [Value], [CreatedAt], [UpdatedAt]
    FROM [dbo].[DataItems]
    WHERE [UserId] = @UserId
    ORDER BY [CreatedAt] DESC;
END;

-- Create stored procedure for creating data item
CREATE PROCEDURE [dbo].[sp_CreateDataItem]
    @Name NVARCHAR(200),
    @Value DECIMAL(18, 2),
    @UserId INT
AS
BEGIN
    INSERT INTO [dbo].[DataItems] ([Name], [Value], [UserId], [CreatedAt])
    VALUES (@Name, @Value, @UserId, GETUTCDATE());
    
    SELECT SCOPE_IDENTITY() AS Id;
END;

-- Create stored procedure for updating data item
CREATE PROCEDURE [dbo].[sp_UpdateDataItem]
    @Id INT,
    @Name NVARCHAR(200),
    @Value DECIMAL(18, 2),
    @UserId INT
AS
BEGIN
    UPDATE [dbo].[DataItems]
    SET [Name] = @Name, [Value] = @Value, [UpdatedAt] = GETUTCDATE()
    WHERE [Id] = @Id AND [UserId] = @UserId;
END;

-- Create stored procedure for deleting data item
CREATE PROCEDURE [dbo].[sp_DeleteDataItem]
    @Id INT,
    @UserId INT
AS
BEGIN
    DELETE FROM [dbo].[DataItems]
    WHERE [Id] = @Id AND [UserId] = @UserId;
END;

-- Create stored procedure for user authentication
CREATE PROCEDURE [dbo].[sp_GetUserByUsername]
    @Username NVARCHAR(50)
AS
BEGIN
    SELECT [Id], [Username], [Email], [FirstName], [LastName], [PasswordHash], [IsActive], [CreatedAt]
    FROM [dbo].[Users]
    WHERE [Username] = @Username;
END;

-- Create stored procedure for audit logging
CREATE PROCEDURE [dbo].[sp_InsertAuditLog]
    @UserId INT,
    @Action NVARCHAR(100),
    @EntityType NVARCHAR(100),
    @EntityId INT,
    @Changes NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO [dbo].[AuditLog] ([UserId], [Action], [EntityType], [EntityId], [Changes], [CreatedAt])
    VALUES (@UserId, @Action, @EntityType, @EntityId, @Changes, GETUTCDATE());
END;
