namespace TodoApi.Helpers
{
    public static class ValidInputs
    {
        public static int CalculateStrength(string password)
        {
            if (string.IsNullOrEmpty(password)) return 0;

            int strength = 0;
        
            if (password.Length >= 8)
            {
                strength += 40;
            }
            else
            {
                return (int)((password.Length / 8.0) * 40);
            }

            if (password.Any(char.IsUpper)) strength += 15;       
            if (password.Any(char.IsLower)) strength += 15;       
            if (password.Any(char.IsDigit)) strength += 15;      
            if (password.Any(c => !char.IsLetterOrDigit(c))) strength += 15; 

            return Math.Min(strength, 100);
        }
    }
}
