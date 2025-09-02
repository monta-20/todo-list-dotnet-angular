using Microsoft.AspNetCore.Mvc;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.EndPoints
{
    public static class TodoEndpoints
    {
        public static void MapTodoEndpoints(this WebApplication app)
        {
            var group = app.MapGroup("/api/v1/todos").WithTags("TodoItems");
            group.MapGet("/", async ([FromServices] TodoService service) =>
            {
                return Results.Ok(await service.GetAllAsync());
            });

            group.MapGet("/{id}", async (long id, [FromServices] TodoService service) =>
            {
                var todo = await service.GetByIdAsync(id);
                return todo is not null ? Results.Ok(todo) : Results.NotFound();
            });

            group.MapPost("/", async ([FromBody] TodoItem todo, [FromServices] TodoService service) =>
            {
                var createdTodo = await service.CreateAsync(todo);
                return Results.Created($"/api/v1/todos/{createdTodo.Id}", createdTodo);
            });

            group.MapPut("/{id}", async (long id, [FromBody] TodoUpdateDto dto, [FromServices] TodoService service) =>
            {
                var updatedTodo = await service.UpdateAsync(id, dto);
                return updatedTodo is not null ? Results.Ok(updatedTodo) : Results.NotFound();
            });

            group.MapDelete("/{id}", async (long id, [FromServices] TodoService service) =>
            {
                var deleted = await service.DeleteAsync(id);
                return deleted ? Results.NoContent() : Results.NotFound();
            });

            group.MapGet("/filtered", async (TodoQueryDto query, [FromServices] TodoService service) =>
            {
                var filteredTodos = await service.GetFilteredAsync(query);
                return Results.Ok(filteredTodos);
            });

        }
    }
}
