using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Data;
using TodoApi.Helpers;
using TodoApi.Models;

namespace TodoApi.EndPoints
{
    public static class TodoEndpoints
    {
        public static void MapTodoEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/v1/todos").WithTags("TodoItems");

            group.MapGet("/", async (ClaimsPrincipal user, TodoService service) =>
            {
                if (!user.TryGetUserId(out var userId))
                    return Results.Unauthorized();

                var todos = await service.GetAllAsync(userId);
                return Results.Ok(todos);
            });

            group.MapGet("/{id}", async (long id, ClaimsPrincipal user, TodoService service) =>
            {
                if (!user.TryGetUserId(out var userId))
                    return Results.Unauthorized();
                var todo = await service.GetByIdAsync(id, userId);
                return todo is not null ? Results.Ok(todo) : Results.NotFound();
            });

            group.MapPost("/", async ([FromBody] TodoItem todo, ClaimsPrincipal user, TodoService service) =>
            {
                if (!user.TryGetUserId(out var userId))
                    return Results.Unauthorized();
                todo.UserId = userId;
                var createdTodo = await service.CreateAsync(todo , userId);
                return Results.Created($"/api/v1/todos/{createdTodo.Id}", createdTodo);
            });

            group.MapPut("/{id}", async (long id, [FromBody] TodoUpdateDto dto, ClaimsPrincipal user, TodoService service) =>
            {
                if (!user.TryGetUserId(out var userId))
                    return Results.Unauthorized();
                var updatedTodo = await service.UpdateAsync(id, dto, userId);
                return updatedTodo is not null ? Results.Ok(updatedTodo) : Results.NotFound();
            });

            group.MapDelete("/{id}", async (long id, ClaimsPrincipal user, TodoService service) =>
            {
                if (!user.TryGetUserId(out var userId))
                    return Results.Unauthorized();
                var deleted = await service.DeleteAsync(id, userId);
                return deleted ? Results.NoContent() : Results.NotFound();
            });

            group.MapGet("/filtered", async ([AsParameters] TodoQueryDto query, ClaimsPrincipal user, TodoService service) =>
            {
                if (!user.TryGetUserId(out var userId))
                    return Results.Unauthorized();
                var filteredTodos = await service.GetFilteredAsync(query, userId);
                return Results.Ok(filteredTodos);
            });

            group.MapPatch("/{id}/toggle-complete", async (long id, ClaimsPrincipal user, TodoService service) =>
            {
                if (!user.TryGetUserId(out var userId))
                    return Results.Unauthorized();
                var updatedTodo = await service.ToggleCompleteAsync(id, userId);
                return updatedTodo is not null ? Results.Ok(updatedTodo) : Results.NotFound();
            });

            group.MapGet("/metadata", () =>
            {
                return Results.Ok(new
                {
                    Priorities = TodoHelpers.Priorities,
                    Categories = TodoHelpers.Categories
                });
            });
        }

    }
}
