using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TodoApi.AppContext;
using TodoApi.Data;
using TodoApi.EndPoints;

var builder = WebApplication.CreateBuilder(args);

// -------------------------
// Configuration DB
// -------------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseNpgsql(connectionString));

// -------------------------
// Ajouter Services
// -------------------------
builder.Services.AddScoped<TodoService>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddEndpointsApiExplorer();

// -------------------------
// Authentification Google + Cookie
// -------------------------
var googleAuth = builder.Configuration.GetSection("Authentication:Google");

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(options =>
{
    options.ClientId = googleAuth["ClientId"];
    options.ClientSecret = googleAuth["ClientSecret"];
    options.Scope.Add("profile");
    options.Scope.Add("email");
    options.SaveTokens = true;
});

// -------------------------
// JWT Authentication
// -------------------------
var jwtSecret = builder.Configuration["Jwt:Secret"];
builder.Services.AddAuthentication()
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecret))
        };
    });

// -------------------------
// Authorization
// -------------------------
builder.Services.AddAuthorization();

// -------------------------
// Polices
// -------------------------
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("UserPolicy", policy => policy.RequireRole("User"));
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOrAdminPolicy", policy => policy.RequireRole("User", "Admin"));
});

// -------------------------
// CORS
// -------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// -------------------------
// Middleware
// -------------------------
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

// -------------------------
// Swagger / OpenAPI
// -------------------------
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// -------------------------
// Endpoints
// -------------------------
app.MapTodoEndpoints();
app.MapAuthEndpoints();

app.Run();
