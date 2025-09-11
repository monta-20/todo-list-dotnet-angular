using System.Net.Mail;
using System.Net;

namespace TodoApi.Data
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var port = int.Parse(_configuration["EmailSettings:Port"]!);
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var password = _configuration["EmailSettings:Password"];

            using var client = new SmtpClient(smtpServer, port)
            {
                Credentials = new NetworkCredential(senderEmail, password),
                EnableSsl = true
            };

            var mail = new MailMessage(senderEmail, to, subject, body);
            await client.SendMailAsync(mail);
        }
    }
}
