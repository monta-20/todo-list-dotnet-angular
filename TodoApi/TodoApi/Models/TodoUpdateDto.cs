using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models
{
    public class TodoUpdateDto
    {
        [Required]
        [MaxLength(200)]
        public long? Id; 
        public string? Title { get; set; }

        [MaxLength(1200)]
        public string? Description { get; set; }

        public bool IsComplete { get; set; }

        [MaxLength(20)]
        public string? Priority { get; set; }

        public DateTimeOffset? DueDate { get; set; }

        public string? Category { get; set; }
        public bool IsOverdue { get; set; }
        public DateTimeOffset LastModifiedAt { get; set; }
    }
}
