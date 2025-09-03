namespace TodoApi.Models
{
    public class TodoQueryDto
    {
        public string? Priority { get; set; }
        public string? Category { get; set; }
        public bool? IsComplete { get; set; }
        public string? Search { get; set; } // titre ou description
        public string? SortBy { get; set; } = "CreatedAt"; 
        public bool? Descending { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
