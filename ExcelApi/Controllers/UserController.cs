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
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst("id")?.Value ?? "0");
        }

        [HttpGet("profile")]
        public async Task<ActionResult<ApiResponse<UserDto>>> GetProfile()
        {
            try
            {
                var userId = GetUserId();
                var user = await _userService.GetById(userId);
                return Ok(new ApiResponse<UserDto>
                {
                    Success = true,
                    Message = "Profile retrieved successfully",
                    Data = user
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

        [HttpPut("profile")]
        public async Task<ActionResult<ApiResponse<UserDto>>> UpdateProfile([FromBody] UpdateUserRequest request)
        {
            try
            {
                var userId = GetUserId();
                var user = await _userService.Update(userId, request);
                return Ok(new ApiResponse<UserDto>
                {
                    Success = true,
                    Message = "Profile updated successfully",
                    Data = user
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

        [HttpPost("change-password")]
        public async Task<ActionResult<ApiResponse<object>>> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var userId = GetUserId();
                await _userService.ChangePassword(userId, request);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Password changed successfully",
                    Data = null
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new ApiErrorResponse
                {
                    Success = false,
                    Message = ex.Message
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
