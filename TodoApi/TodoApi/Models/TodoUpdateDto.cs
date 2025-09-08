using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models
{
    public class TodoUpdateDto
    {
        public long Id { get; set; }
        public string? Title { get; set; }
        public bool IsComplete { get; set; }
        public string? Description { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
        public bool IsOverdue { get; set; }
        public bool CanToggle { get; set; } 
        public DateTimeOffset? DueDate { get; set; }
        public DateTimeOffset LastModifiedAt { get; set; }
    }
}
