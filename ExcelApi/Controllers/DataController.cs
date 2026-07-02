using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExcelApi.DTOs;
using ExcelApi.Services;
using System.Security.Claims;

namespace ExcelApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DataController : ControllerBase
    {
        private readonly IDataService _dataService;
        private readonly ILogger<DataController> _logger;

        public DataController(IDataService dataService, ILogger<DataController> logger)
        {
            _dataService = dataService;
            _logger = logger;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst("id")?.Value ?? "0");
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<DataItemDto>>>> GetAll()
        {
            try
            {
                var userId = GetUserId();
                var items = await _dataService.GetAll(userId);
                return Ok(new ApiResponse<List<DataItemDto>>
                {
                    Success = true,
                    Message = "Items retrieved successfully",
                    Data = items
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving items");
                return BadRequest(new ApiErrorResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<DataItemDto>>> GetById(int id)
        {
            try
            {
                var userId = GetUserId();
                var item = await _dataService.GetById(id, userId);
                return Ok(new ApiResponse<DataItemDto>
                {
                    Success = true,
                    Message = "Item retrieved successfully",
                    Data = item
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiErrorResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<DataItemDto>>> Create([FromBody] CreateDataItemRequest request)
        {
            try
            {
                var userId = GetUserId();
                var item = await _dataService.Create(request, userId);
                return CreatedAtAction(nameof(GetById), new { id = item.Id }, new ApiResponse<DataItemDto>
                {
                    Success = true,
                    Message = "Item created successfully",
                    Data = item
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating item");
                return BadRequest(new ApiErrorResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<DataItemDto>>> Update(int id, [FromBody] UpdateDataItemRequest request)
        {
            try
            {
                var userId = GetUserId();
                var item = await _dataService.Update(id, request, userId);
                return Ok(new ApiResponse<DataItemDto>
                {
                    Success = true,
                    Message = "Item updated successfully",
                    Data = item
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiErrorResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
        {
            try
            {
                var userId = GetUserId();
                await _dataService.Delete(id, userId);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Item deleted successfully",
                    Data = null
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiErrorResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }
    }
}
