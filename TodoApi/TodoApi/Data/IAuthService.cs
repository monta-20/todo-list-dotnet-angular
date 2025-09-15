using TodoApi.Models;

namespace TodoApi.Data
{
    public interface IAuthService
    {
        Task<User> SignUpAsync(string email, string password, string name);
        Task<string> SignInWithJwtAsync(string email, string password);
        Task<string> GoogleLoginAsync(string email, string name, string googleToken);
        Task<User?> GetCurrentUserAsync(string email);
        Task<PagedResult<User>> GetAllUsersAsync(string email, string? search, string? role , string? sortBy, bool descending, int page, int pageSize);
        Task<User?> GetUserByEmailAsync(string email);
        Task<bool> BlockUserAsync(long id, User admin);
        Task<bool> UnblockUserAsync(long id, User admin); 
        string GenerateJwtToken(User user); 

    }
}
