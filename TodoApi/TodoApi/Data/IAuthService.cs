using TodoApi.Models;

namespace TodoApi.Data
{
    public interface IAuthService
    {
        Task<User> SignUpAsync(string email, string password, string name);
        Task<string> SignInWithJwtAsync(string email, string password);
        Task<string> GoogleLoginAsync(string email, string name, string googleToken);
        Task<User?> GetCurrentUserAsync(string email);
        string GenerateJwtToken(User user); 

    }
}
