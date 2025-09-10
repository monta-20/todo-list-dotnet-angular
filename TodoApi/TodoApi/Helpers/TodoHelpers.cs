using System.Security.Claims;

namespace TodoApi.Helpers
{
    public static class TodoHelpers
    {
        public static readonly List<string> Priorities = new()
    {
        "Basse",
        "Moyenne",
        "Haute"
    };

        public static readonly List<string> Categories = new()
    {
        "Sport",
        "Santé",
        "Travail",
        "Apprentissage",
        "Loisir"
    };

        public static bool IsValidPriority(string? priority)
        {
            return !string.IsNullOrWhiteSpace(priority) && Priorities.Contains(priority);
        }

        public static bool IsValidCategory(string? category)
        {
            return !string.IsNullOrWhiteSpace(category) && Categories.Contains(category);
        }
        public static bool TryGetUserId(this ClaimsPrincipal user, out long userId)
        {
            userId = 0;

            // Essaie d'abord le claim NameIdentifier
            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier)
                              ?? user.FindFirstValue("sub"); // pour Google OAuth

            if (string.IsNullOrEmpty(userIdClaim))
                return false;

            return long.TryParse(userIdClaim, out userId);
        }
    }
}

