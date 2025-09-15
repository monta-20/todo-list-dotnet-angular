using System.Security.Claims;
using TodoApi.Data;
using TodoApi.Helpers;
using TodoApi.Models;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/todos/auth");
        // -------------------------
        // SIGN UP (Email + Password)
        // -------------------------
        group.MapPost("/signup", async (AuthService auth, AuthRequest request) =>
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return Results.BadRequest("Email et mot de passe requis");

            try
            {
                var user = await auth.SignUpAsync(request.Email, request.Password, request.Name ?? "");

                return Results.Ok(new AuthResponse
                {
                    Email = user.Email,
                    Name = user.Name,
                    Role = user.Role.ToString(),
                    Token = auth.GenerateJwtToken(user)
                });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        });

        // -------------------------
        // SIGN IN (Email + Password)
        // -------------------------
        group.MapPost("/signin", async (AuthService auth, AuthRequest request) =>
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return Results.BadRequest("Email et mot de passe requis");

            try
            {
                var token = await auth.SignInWithJwtAsync(request.Email, request.Password);
                var user = await auth.GetCurrentUserAsync(request.Email);

                return Results.Ok(new AuthResponse
                {
                    Email = user?.Email ?? "",
                    Name = user?.Name ?? "",
                    Role = user?.Role.ToString() ?? "User",
                    Token = token
                });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        });

        // -------------------------
        // GOOGLE LOGIN
        // -------------------------
        group.MapPost("/google", async (AuthService auth, AuthRequest request) =>
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.GoogleToken))
                return Results.BadRequest("Email et Google token requis");

            try
            {
                var token = await auth.GoogleLoginAsync(request.Email, request.Name ?? "", request.GoogleToken);
                var user = await auth.GetCurrentUserAsync(request.Email);

                return Results.Ok(new AuthResponse
                {
                    Email = user?.Email ?? "",
                    Name = user?.Name ?? "",
                    Role = user?.Role.ToString() ?? "User",
                    Token = token
                });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        });

        // -------------------------
        // GET CURRENT USER
        // -------------------------
        group.MapGet("/me", async (AuthService auth, HttpContext context) =>
        {
            var email = context.User?.FindFirst(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null)
                return Results.Unauthorized();

            var user = await auth.GetCurrentUserAsync(email);
            if (user == null)
                return Results.NotFound("Utilisateur non trouvé");

            return Results.Ok(new AuthResponse
            {
                Email = user.Email,
                Name = user.Name,
                Role = user.Role.ToString()
            });
        }).RequireAuthorization("UserOrAdminPolicy");

        // -------------------------
        // GET ALL USERS (ADMIN ONLY)
        // -------------------------
        group.MapGet("/users", async (AuthService auth, HttpContext context,
                              string? search, string? role, string? sortBy, bool descending = false,
                              int page = 1, int pageSize = 5) =>
        {
            var email = context.User?.FindFirst(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null)
                return Results.Unauthorized();

            try
            {
                // Appel au service avec pagination, tri, recherche et filtre par rôle
                var pagedResult = await auth.GetAllUsersAsync(email, search, role, sortBy, descending, page, pageSize);

                // Mapper pour exposer uniquement les informations publiques
                var result = pagedResult.Items.Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    Role = u.Role.ToString(),
                    CreatedAt = u.CreatedAt
                });

                return Results.Ok(new
                {
                    items = result,
                    total = pagedResult.Total
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Results.Forbid();
            }
        }).RequireAuthorization("AdminPolicy");

        // -------------------------
        // Bloquer un utilisateur (ADMIN ONLY)
        // -------------------------
        group.MapPatch("/users/{id}/block", async (long id, AuthService auth, HttpContext context) =>
        {
            var email = context.User?.FindFirst(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null) return Results.Unauthorized();

            var currentUser = await auth.GetUserByEmailAsync(email);
            if (currentUser.Role != UserRole.Admin) return Results.Forbid();

            var success = await auth.BlockUserAsync(id, currentUser);
            if (!success) return Results.BadRequest("Impossible de bloquer cet utilisateur");

            return Results.Ok(new { message = "Utilisateur bloqué avec succès" });
        }).RequireAuthorization("AdminPolicy");

        // -------------------------
        // Débloquer un utilisateur (ADMIN ONLY)
        // -------------------------
        group.MapPatch("/users/{id}/unblock", async (long id, AuthService auth, HttpContext context) =>
        {
            var email = context.User?.FindFirst(c => c.Type == ClaimTypes.Email)?.Value;
            if (email == null) return Results.Unauthorized();

            var currentUser = await auth.GetUserByEmailAsync(email);
            if (currentUser.Role != UserRole.Admin) return Results.Forbid();
            var success = await auth.UnblockUserAsync(id, currentUser);
            if (!success) return Results.BadRequest("Impossible de débloquer cet utilisateur");
      
            return Results.Ok(new { message = "Utilisateur débloqué avec succès" });
        }).RequireAuthorization("AdminPolicy");
    }
}
