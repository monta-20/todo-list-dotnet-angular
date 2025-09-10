using TodoApi.Models;

namespace TodoApi.Data
{
    public interface ITodoService
    {
        Task<List<TodoItem>> GetAllAsync(long userId);
        Task<TodoItem?> GetByIdAsync(long id , long userId);
        Task<TodoItem> CreateAsync(TodoItem todo, long userId);
        Task<TodoItem?> UpdateAsync(long id, TodoUpdateDto dto, long userId);
        Task<bool> DeleteAsync(long id, long userId);
        Task<PagedResult<TodoItem>> GetFilteredAsync(TodoQueryDto quer  , long userId);
        Task<TodoUpdateDto?> ToggleCompleteAsync(long id, long userId);
    }
}
