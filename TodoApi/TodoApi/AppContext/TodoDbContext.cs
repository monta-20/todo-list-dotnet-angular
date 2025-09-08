using System.Security.Cryptography.X509Certificates;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.AppContext
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options) { }
       
        public DbSet<TodoItem> TodoItems { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
