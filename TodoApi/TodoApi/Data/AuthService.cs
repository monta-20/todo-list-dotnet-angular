using System.Security.Claims;
using System.Text;
using TodoApi.Models;
using TodoApi.AppContext;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace TodoApi.Data
{
    public class AuthService : IAuthService
    {
        private readonly TodoDbContext _db;
        private readonly string _jwtSecret;
        private readonly List<string> _adminEmails;

        public AuthService(TodoDbContext db, IConfiguration config)
        {
            _db = db;
            _jwtSecret = config["Jwt:Secret"] ?? throw new Exception("JWT Secret manquant");
            _adminEmails = config.GetSection("Admins").Get<List<string>>() ?? new List<string>();
        }

        // ------------------------- 
        // SIGN UP (Email + Password)
        // -------------------------
        public async Task<User> SignUpAsync(string email, string password, string name)
        {
            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existingUser != null)
                throw new Exception("Utilisateur déjà existant");

            var user = new User
            {
                Email = email,
                Name = name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = _adminEmails.Contains(email.ToLower()) ? Helpers.UserRole.Admin : Helpers.UserRole.User,
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow,
                IsActive = true
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }


        // -------------------------
        // SIGN IN (Email + Password)
        // -------------------------
        public async Task<string> SignInWithJwtAsync(string email, string password)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                throw new Exception("Utilisateur non trouvé");

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                throw new Exception("Mot de passe incorrect");

            user.LastLoginAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return GenerateJwtToken(user);
        }

        // -------------------------
        // GOOGLE LOGIN
        // -------------------------
        public async Task<string> GoogleLoginAsync(string email, string name, string googleToken)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                user = new User
                {
                    Email = email,
                    Name = name,
                    GoogleToken = googleToken,
                    Role = Helpers.UserRole.User,
                    CreatedAt = DateTime.UtcNow,
                    LastLoginAt = DateTime.UtcNow,
                    IsActive = true
                };
                _db.Users.Add(user);
            }
            else
            {
                user.GoogleToken = googleToken;
                user.LastLoginAt = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();
            return GenerateJwtToken(user);
        }

        // -------------------------
        // RECUPERER L'UTILISATEUR ACTUEL
        // -------------------------
        public async Task<User?> GetCurrentUserAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                return null;

            return await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        // -------------------------
        // GENERER JWT
        // -------------------------
        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Role, user.Role.ToString())
    }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };


            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
