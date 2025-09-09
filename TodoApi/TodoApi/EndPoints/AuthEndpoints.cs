using System.Security.Claims;
using TodoApi.Data;
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
    }
}
