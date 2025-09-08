namespace TodoApi.Models
{
    public class AuthRequest
    {
        public string? Email { get; set; } = null;
        public string? Password { get; set; } = null;
        public string? GoogleToken { get; set; } = null;
        public string? Name { get; set; } = null;
    }

    public class AuthResponse
    {
        public string Token { get; set; } = "";
        public string Email { get; set; } = "";
        public string Name { get; set; } = "";
        public string Role { get; set; } = "User";
    }
}
