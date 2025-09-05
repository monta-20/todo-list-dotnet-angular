using TodoApi.Models;

namespace TodoApi.Data
{
    public interface ITodoService
    {
        Task<List<TodoItem>> GetAllAsync();
        Task<TodoItem?> GetByIdAsync(long id);
        Task<TodoItem> CreateAsync(TodoItem todo);
        Task<TodoItem?> UpdateAsync(long id, TodoUpdateDto dto);
        Task<bool> DeleteAsync(long id);
        Task<PagedResult<TodoItem>> GetFilteredAsync(TodoQueryDto query);
        Task<TodoUpdateDto?> ToggleCompleteAsync(long id);
    }
}
