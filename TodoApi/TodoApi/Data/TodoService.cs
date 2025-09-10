using Microsoft.EntityFrameworkCore;
using TodoApi.AppContext;
using TodoApi.Helpers;
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
        public async Task<TodoItem> CreateAsync(TodoItem todo , long userId)
        {
            todo.UserId = userId;
            // Forcer UTC
            todo.CreatedAt = DateTimeOffset.UtcNow;
            todo.LastModifiedAt = DateTimeOffset.UtcNow;

            if (todo.DueDate.HasValue)
                todo.DueDate = todo.DueDate.Value.ToUniversalTime();

            // Validation des priorités et catégories
            if (!TodoHelpers.IsValidPriority(todo.Priority))
                throw new ArgumentException($"Priorité invalide. Valeurs autorisées : {string.Join(", ", TodoHelpers.Priorities)}");

            if (!TodoHelpers.IsValidCategory(todo.Category))
                throw new ArgumentException($"Catégorie invalide. Valeurs autorisées : {string.Join(", ", TodoHelpers.Categories)}");

            await _context.TodoItems.AddAsync(todo);
            await _context.SaveChangesAsync();
            return todo;
        }
        public async Task<bool> DeleteAsync(long id , long userId)
        {
            var existingTodo = await _context.TodoItems.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (existingTodo == null) return false;

            _context.TodoItems.Remove(existingTodo);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<TodoItem>> GetAllAsync(long userId)
        {
            return await _context.TodoItems.Where(t => t.UserId == userId).ToListAsync();
        }
        public async Task<TodoItem?> GetByIdAsync(long id , long userId)
        {
            return await _context.TodoItems.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }
        public async Task<TodoItem?> UpdateAsync(long id, TodoUpdateDto dto , long userId)
        {
            var existingTodo = await _context.TodoItems.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (existingTodo == null) return null;
            if (!TodoHelpers.IsValidPriority(dto.Priority))
                throw new ArgumentException($"Priorité invalide. Valeurs autorisées : {string.Join(", ", TodoHelpers.Priorities)}");

            if (!TodoHelpers.IsValidCategory(dto.Category))
                throw new ArgumentException($"Catégorie invalide. Valeurs autorisées : {string.Join(", ", TodoHelpers.Categories)}");

            existingTodo.Title = dto.Title;
            existingTodo.Description = dto.Description;
            existingTodo.IsComplete = dto.IsComplete;
            existingTodo.Priority = dto.Priority;
            existingTodo.Category = dto.Category;

            if (dto.DueDate.HasValue)
                existingTodo.DueDate = dto.DueDate.Value.ToUniversalTime();

            existingTodo.LastModifiedAt = DateTimeOffset.UtcNow;

            await _context.SaveChangesAsync();
            return existingTodo;
        }
        public async Task<PagedResult<TodoItem>> GetFilteredAsync(TodoQueryDto query , long userId)
        {
            var todos = _context.TodoItems.Where(t => t.UserId == userId).AsQueryable();
            // Filtrage
            if (!string.IsNullOrEmpty(query.Priority))
                todos = todos.Where(t => t.Priority == query.Priority);

            if (!string.IsNullOrEmpty(query.Category))
                todos = todos.Where(t => t.Category == query.Category);

            if (query.IsComplete.HasValue)
                todos = todos.Where(t => t.IsComplete == query.IsComplete.Value);

            if (!string.IsNullOrEmpty(query.Search))
            {
                todos = todos.Where(t =>
                    EF.Functions.ILike(t.Title, $"%{query.Search}%") ||
                    (t.Description != null && EF.Functions.ILike(t.Description, $"%{query.Search}%"))
                );
            }

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
        public async Task<TodoUpdateDto?> ToggleCompleteAsync(long id, long userId)
        {
            var todo = await _context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todo == null) return null;

            if (todo.CanToggle)
            {
                todo.IsComplete = !todo.IsComplete;
                todo.LastModifiedAt = DateTimeOffset.UtcNow;
                await _context.SaveChangesAsync();
            }

            return new TodoUpdateDto
            {
                Id = todo.Id,
                Title = todo.Title,
                IsComplete = todo.IsComplete,
                IsOverdue = todo.IsOverdue,
                CanToggle = todo.CanToggle,
                DueDate = todo.DueDate,
                LastModifiedAt = todo.LastModifiedAt
            };
        }

    }
}
