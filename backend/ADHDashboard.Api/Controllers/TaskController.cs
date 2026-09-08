using ADHDashboard.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ADHDashboard.Api.Controllers;

[ApiController]
[Route("tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public TasksController(ApplicationDbContext db)
    {
        _db = db;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")!
        );
    }

    [HttpGet]
    public IActionResult GetTasks()
    {
        var userId = GetUserId();

        var tasks = _db.Tasks
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Done)
            .ThenByDescending(x => x.CreatedAt)
            .ToList();

        return Ok(tasks);
    }

    [HttpPost]
    public IActionResult AddTask([FromBody] CreateTaskRequest request)
    {
        var userId = GetUserId();

        var task = new ADHDashboard.Api.Data.Task
        {
            Title = request.Title,
            Type = request.Type ?? "general",
            Done = false,
            UserId = userId
        };

        _db.Tasks.Add(task);
        _db.SaveChanges();

        return Ok(task);
    }

    [HttpPut("{id}/toggle")]
    public IActionResult ToggleTask(int id)
    {
        var userId = GetUserId();

        var task = _db.Tasks
            .FirstOrDefault(x => x.Id == id && x.UserId == userId);

        if (task == null)
            return NotFound();

        task.Done = !task.Done;

        _db.SaveChanges();

        return Ok(task);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteTask(int id)
    {
        var userId = GetUserId();

        var task = _db.Tasks
            .FirstOrDefault(x => x.Id == id && x.UserId == userId);

        if (task == null)
            return NotFound();

        _db.Tasks.Remove(task);
        _db.SaveChanges();

        return NoContent();
    }
}

public class CreateTaskRequest
{
    public string Title { get; set; } = "";

    public string? Type { get; set; }
}