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
        [MaxLength(1200)]
        public string? Description { get; set; } 
        public bool IsComplete { get; set; }
        [MaxLength(20)]
        public string? Priority { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastModifiedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
        public string? Category { get; set; }

    }
}
