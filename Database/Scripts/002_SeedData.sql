-- Seed Users
SET IDENTITY_INSERT [dbo].[Users] ON;

INSERT INTO [dbo].[Users] ([Id], [Username], [Email], [FirstName], [LastName], [PasswordHash], [IsActive], [CreatedAt])
VALUES 
    (1, 'admin', 'admin@example.com', 'Admin', 'User', '$2a$11$8VKvgVIQJD.KjRf9DvlGDOvDvH.j3XQFNW8n7Q5P8X8eFx2XqOyOe', 1, GETUTCDATE()),
    (2, 'testuser', 'test@example.com', 'Test', 'User', '$2a$11$8VKvgVIQJD.KjRf9DvlGDOvDvH.j3XQFNW8n7Q5P8X8eFx2XqOyOe', 1, GETUTCDATE()),
    (3, 'demo', 'demo@example.com', 'Demo', 'User', '$2a$11$8VKvgVIQJD.KjRf9DvlGDOvDvH.j3XQFNW8n7Q5P8X8eFx2XqOyOe', 1, GETUTCDATE());

SET IDENTITY_INSERT [dbo].[Users] OFF;

-- Seed DataItems
SET IDENTITY_INSERT [dbo].[DataItems] ON;

INSERT INTO [dbo].[DataItems] ([Id], [Name], [Value], [UserId], [CreatedAt])
VALUES 
    (1, 'Item 1', 100.00, 1, GETUTCDATE()),
    (2, 'Item 2', 200.50, 1, GETUTCDATE()),
    (3, 'Item 3', 150.75, 1, GETUTCDATE()),
    (4, 'Test Item 1', 50.00, 2, GETUTCDATE()),
    (5, 'Test Item 2', 75.25, 2, GETUTCDATE()),
    (6, 'Demo Item 1', 300.00, 3, GETUTCDATE());

SET IDENTITY_INSERT [dbo].[DataItems] OFF;

-- Note: Password for all seed users is 'password123'
-- Hashed with BCrypt
