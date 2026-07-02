-- Create view for user data summary
CREATE VIEW [dbo].[vw_UserDataSummary] AS
SELECT 
    u.[Id],
    u.[Username],
    u.[Email],
    u.[FirstName],
    u.[LastName],
    COUNT(di.[Id]) AS TotalItems,
    SUM(di.[Value]) AS TotalValue,
    AVG(di.[Value]) AS AverageValue,
    MAX(di.[Value]) AS MaxValue,
    MIN(di.[Value]) AS MinValue
FROM [dbo].[Users] u
LEFT JOIN [dbo].[DataItems] di ON u.[Id] = di.[UserId]
GROUP BY u.[Id], u.[Username], u.[Email], u.[FirstName], u.[LastName];

-- Create view for recent activities
CREATE VIEW [dbo].[vw_RecentActivities] AS
SELECT TOP 100
    al.[Id],
    u.[Username],
    al.[Action],
    al.[EntityType],
    al.[EntityId],
    al.[CreatedAt]
FROM [dbo].[AuditLog] al
LEFT JOIN [dbo].[Users] u ON al.[UserId] = u.[Id]
ORDER BY al.[CreatedAt] DESC;
