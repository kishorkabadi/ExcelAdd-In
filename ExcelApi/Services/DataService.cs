using ExcelApi.DTOs;
using ExcelApi.Models;

namespace ExcelApi.Services
{
    public interface IDataService
    {
        Task<List<DataItemDto>> GetAll(int userId);
        Task<DataItemDto> GetById(int id, int userId);
        Task<DataItemDto> Create(CreateDataItemRequest request, int userId);
        Task<DataItemDto> Update(int id, UpdateDataItemRequest request, int userId);
        Task Delete(int id, int userId);
    }

    public class DataService : IDataService
    {
        private readonly ExcelApi.Data.ExcelContext _context;
        private readonly ILogger<DataService> _logger;

        public DataService(ExcelApi.Data.ExcelContext context, ILogger<DataService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<DataItemDto>> GetAll(int userId)
        {
            var items = await _context.DataItems
                .Where(d => d.UserId == userId)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return items.Select(MapToDataItemDto).ToList();
        }

        public async Task<DataItemDto> GetById(int id, int userId)
        {
            var item = await _context.DataItems
                .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

            if (item == null)
            {
                throw new KeyNotFoundException($"Data item {id} not found");
            }

            return MapToDataItemDto(item);
        }

        public async Task<DataItemDto> Create(CreateDataItemRequest request, int userId)
        {
            var dataItem = new DataItem
            {
                Name = request.Name,
                Value = request.Value,
                UserId = userId
            };

            _context.DataItems.Add(dataItem);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Data item created: {dataItem.Id} for user {userId}");

            return MapToDataItemDto(dataItem);
        }

        public async Task<DataItemDto> Update(int id, UpdateDataItemRequest request, int userId)
        {
            var item = await _context.DataItems
                .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

            if (item == null)
            {
                throw new KeyNotFoundException($"Data item {id} not found");
            }

            item.Name = request.Name;
            item.Value = request.Value;
            item.UpdatedAt = DateTime.UtcNow;

            _context.DataItems.Update(item);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Data item updated: {item.Id}");

            return MapToDataItemDto(item);
        }

        public async Task Delete(int id, int userId)
        {
            var item = await _context.DataItems
                .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

            if (item == null)
            {
                throw new KeyNotFoundException($"Data item {id} not found");
            }

            _context.DataItems.Remove(item);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Data item deleted: {id}");
        }

        private DataItemDto MapToDataItemDto(DataItem item)
        {
            return new DataItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Value = item.Value,
                CreatedAt = item.CreatedAt,
                UpdatedAt = item.UpdatedAt
            };
        }
    }
}
