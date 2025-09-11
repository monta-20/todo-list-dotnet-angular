using Microsoft.EntityFrameworkCore;
using TodoApi.AppContext;
using TodoApi.Data;

namespace TodoApi.Background
{
    public class EmailReminderService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<EmailReminderService> _logger;

        public EmailReminderService(IServiceScopeFactory scopeFactory, ILogger<EmailReminderService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var db = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
                        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                        var today = DateTime.Now.Date;
                        var tomorrow = today.AddDays(1);

                        // Rappel 1 jour avant échéance
                        var dueTomorrow = await db.TodoItems
                            .Include(t => t.User)
                            .Where(t => t.DueDate.HasValue &&
                                        t.DueDate.Value.LocalDateTime.Date == tomorrow &&
                                        !t.IsComplete)
                            .ToListAsync();

                        foreach (var todo in dueTomorrow)
                        {
                            var subject = $"⏰ Rappel : \"{todo.Title}\" arrive à échéance demain";
                            var body = $"Bonjour {todo.User.Name},\n\n" +
                                       $"Votre tâche \"{todo.Title}\" doit être complétée demain ({todo.DueDate:dd/MM/yyyy}).";
                            await emailService.SendEmailAsync(todo.User.Email, subject, body);
                        }

                        // Tâches en retard (IsOverdue = true)
                        var overdueTodos = await db.TodoItems
                            .Include(t => t.User)
                            .Where(t => t.DueDate.HasValue &&
                                        t.DueDate.Value.LocalDateTime.Date < today &&
                                        !t.IsComplete)
                            .ToListAsync();

                        foreach (var todo in overdueTodos)
                        {
                            var subject = $"⚠️ Tâche échouée : \"{todo.Title}\" est en retard";
                            var body = $"Bonjour {todo.User.Name},\n\n" +
                                       $"Votre tâche \"{todo.Title}\" est échouée (échéance : {todo.DueDate:dd/MM/yyyy}).";
                            await emailService.SendEmailAsync(todo.User.Email, subject, body);
                        }

                        // Félicitations si tâche complétée
                        var completedToday = await db.TodoItems
                            .Include(t => t.User)
                            .Where(t => t.IsComplete &&
                                        t.LastModifiedAt.LocalDateTime.Date == today)
                            .ToListAsync();

                        foreach (var todo in completedToday)
                        {
                            var subject = $"🎉 Bravo : \"{todo.Title}\" a été complétée !";
                            var body = $"Bonjour {todo.User.Name},\n\n" +
                                       $"Félicitations 🎉 vous avez complété la tâche \"{todo.Title}\" aujourd'hui.";
                            await emailService.SendEmailAsync(todo.User.Email, subject, body);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erreur lors de l’envoi des emails Todo.");
                }

                // Vérifie une fois par jour
                await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
            }
        }

    }
}
