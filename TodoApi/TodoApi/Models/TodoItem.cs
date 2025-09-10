using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TodoApi.Models
{
    public class TodoItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        [Required]
        [MaxLength(200)]
        public string? Title { get; set; }
        [Required]
        [MaxLength(1200)]
        public string? Description { get; set; } 
        public bool IsComplete { get; set; }
        [Required]
        public string? Priority { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset LastModifiedAt { get; set; }
        [Required]
        public DateTimeOffset? DueDate { get; set; }
        [Required]
        public string? Category { get; set; }
        [NotMapped]
        public bool IsOverdue => DueDate.HasValue && DueDate.Value.LocalDateTime.Date < DateTime.Now.Date;
        [NotMapped]
        public bool CanToggle => DueDate.HasValue && DueDate.Value.LocalDateTime.Date >= DateTime.Now.Date;

        // Relationships with User One-to-Many
        public long UserId { get; set; }
        public User User { get; set; } = null; 
    }
}
