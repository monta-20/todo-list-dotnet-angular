using System.Security.Claims;
using System.Text;
using TodoApi.Models;
using TodoApi.AppContext;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Helpers;

namespace TodoApi.Data
{
    public class AuthService : IAuthService
    {
        private readonly TodoDbContext _db;
        private readonly string _jwtSecret;
        private readonly string _adminEmail;

        public AuthService(TodoDbContext db, IConfiguration config)
        {
            _db = db;
            _jwtSecret = config["Jwt:Secret"] ?? throw new Exception("JWT Secret manquant");
            _adminEmail = config["AdminEmail"] ?? throw new Exception("AdminEmail manquant");
        }

        // ------------------------- 
        // SIGN UP (Email + Password)
        // -------------------------
        public async Task<User> SignUpAsync(string email, string password, string name)
        {
            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (existingUser != null)
            {
                if (existingUser.IsBlocked)
                    throw new Exception("Votre compte est bloqué. Contactez l’administrateur.");
                throw new Exception("Utilisateur déjà existant");
            }

            int strength = ValidInputs.CalculateStrength(password);
            if (strength < 86) 
            {
                throw new Exception("Le mot de passe est trop faible. Veuillez choisir un mot de passe plus fort.");
            }

            var user = new User
            {
                Email = email,
                Name = name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = email.ToLower() == _adminEmail.ToLower() ? Helpers.UserRole.Admin : Helpers.UserRole.User,
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

            if (user.IsBlocked)
                throw new Exception("Votre compte est bloqué. Contactez l’administrateur.");

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
                if (user.IsBlocked)
                    throw new Exception("Votre compte est bloqué. Contactez l’administrateur.");

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

            return await _db.Users.Include(u => u.TodoItems).FirstOrDefaultAsync(u => u.Email == email);
        
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
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // -------------------------
        // RECUPERER TOUS LES UTILISATEURS (ADMIN SEULEMENT)
        // -------------------------
        public async Task<PagedResult<User>> GetAllUsersAsync(string email,string? search = null,string? role = null,        string? sortBy = "Name",bool descending = false,int page = 1,int pageSize = 5)
        {
            var currentUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (currentUser == null)
                throw new Exception("Utilisateur non trouvé");

            if (currentUser.Role != Helpers.UserRole.Admin)
                throw new UnauthorizedAccessException("Accès refusé : seul un administrateur peut récupérer tous les utilisateurs");

            // Récupérer tous les utilisateurs
            var query = _db.Users.AsQueryable();

            // Recherche
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(u => u.Name.ToLower().Contains(search) || u.Email.ToLower().Contains(search));
            }

            // Filtre par rôle
            if (!string.IsNullOrWhiteSpace(role))
            {
                role = role.ToLower();
                query = query.Where(u => u.Role.ToString().ToLower() == role);
            }

            // Tri
            query = sortBy?.ToLower() switch
            {
                "name" => descending ? query.OrderByDescending(u => u.Name) : query.OrderBy(u => u.Name),
                "email" => descending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
                "role" => descending ? query.OrderByDescending(u => u.Role.ToString()) : query.OrderBy(u => u.Role.ToString()),
                _ => query.OrderBy(u => u.Name)
            };

            // Pagination
            var totalItems = await query.CountAsync();
            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<User>
            {
                Items = users,
                Total = totalItems
            };
        }

        // -------------------------
        // RECUPERER UN UTILISATEUR PAR EMAIL
        // -------------------------
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        // -------------------------
        // BLOQUER UN UTILISATEUR (ADMIN SEULEMENT)
        // -------------------------
        public async Task<bool> BlockUserAsync(long id, User admin)
        {
            if (admin == null || admin.Role != Helpers.UserRole.Admin)
                throw new UnauthorizedAccessException("Seul un administrateur peut bloquer un utilisateur.");

            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return false;

            if (user.Role == Helpers.UserRole.Admin)
                return false; 

            user.IsBlocked = true;
            await _db.SaveChangesAsync();
            return true;
        }

        // -------------------------
        // DÉBLOQUER UN UTILISATEUR (ADMIN SEULEMENT)
        // -------------------------
        public async Task<bool> UnblockUserAsync(long id, User admin)
        {
            if (admin == null || admin.Role != Helpers.UserRole.Admin)
                throw new UnauthorizedAccessException("Seul un administrateur peut débloquer un utilisateur.");

            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return false;

            if (user.Role == Helpers.UserRole.Admin)
                return false; 

            user.IsBlocked = false;
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
