using Microsoft.EntityFrameworkCore;
using TodoApi.AppContext;
using TodoApi.Models;

namespace TodoApi.Data
{
    public class TodoService : ITodoService
    {
        private readonly TodoDbContext _context;
        public TodoService(TodoDbContext context)
        {
            _context = context; 
        }
        public async Task<TodoItem> CreateAsync(TodoItem todo)
        {
            await _context.TodoItems.AddAsync(todo);
            await _context.SaveChangesAsync();
            return todo;
        }
        public async Task<bool> DeleteAsync(long id)
        {
            var existingTodo = await _context.TodoItems.FindAsync(id); 
            if(existingTodo == null)
            {
                return false;
            }
            _context.TodoItems.Remove(existingTodo);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<TodoItem>> GetAllAsync()
        {
            return await _context.TodoItems.ToListAsync(); 
        }
        public async Task<TodoItem?> GetByIdAsync(long id)
        {
            return await _context.TodoItems.FindAsync(id);
        }
        public async Task<TodoItem?> UpdateAsync(long id, TodoUpdateDto dto )
        {
            var existingTodo = await _context.TodoItems.FindAsync(id);
            if (existingTodo == null)
            {
                return null; 
            }
            existingTodo.Title = dto.Title;
            existingTodo.Description = dto.Description;
            existingTodo.IsComplete = dto.IsComplete;
            existingTodo.Priority = dto.Priority;
            existingTodo.DueDate = dto.DueDate;
            existingTodo.Category = dto.Category;
            existingTodo.LastModifiedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return existingTodo;
        }
        public async Task<PagedResult<TodoItem>> GetFilteredAsync(TodoQueryDto query)
        {
            var todos = _context.TodoItems.AsQueryable();

            // Filtrage
            if (!string.IsNullOrEmpty(query.Priority))
                todos = todos.Where(t => t.Priority == query.Priority);

            if (!string.IsNullOrEmpty(query.Category))
                todos = todos.Where(t => t.Category == query.Category);

            if (query.IsComplete.HasValue)
                todos = todos.Where(t => t.IsComplete == query.IsComplete.Value);

            if (!string.IsNullOrEmpty(query.Search))
                todos = todos.Where(t => t.Title.Contains(query.Search) ||
                                         (t.Description != null && t.Description.Contains(query.Search)));

            // Total avant pagination
            int total = await todos.CountAsync();

            // Tri
            todos = query.SortBy?.ToLower() switch
            {
                "title" => query.Descending == true ? todos.OrderByDescending(t => t.Title) : todos.OrderBy(t => t.Title),
                "priority" => query.Descending == true ? todos.OrderByDescending(t => t.Priority) : todos.OrderBy(t => t.Priority),
                "createdat" => query.Descending == true ? todos.OrderByDescending(t => t.CreatedAt) : todos.OrderBy(t => t.CreatedAt),
                "duedate" => query.Descending == true ? todos.OrderByDescending(t => t.DueDate) : todos.OrderBy(t => t.DueDate),
                _ => todos.OrderBy(t => t.Id),
            };

            // Pagination
            var items = await todos
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return new PagedResult<TodoItem>
            {
                Items = items,
                Total = total
            };
        }

    }
}
