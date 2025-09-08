using TodoApi.Helpers;

namespace TodoApi.Models
{
    public class User
    {
        public int Id { get; set; }                 
        public string Email { get; set; } = "";   
        public string Name { get; set; } = "";    
        public string? PasswordHash { get; set; } 
        public string? GoogleToken { get; set; }   
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public UserRole Role { get; set; } = UserRole.User;
    }
}
