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
    }

}
