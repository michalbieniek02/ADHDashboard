using ADHDashboard.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ADHDashboard.Api.Controllers;

[ApiController]
[Route("finance")]
[Authorize]
public class FinanceController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public FinanceController(ApplicationDbContext db)
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

    // =========================
    // FINANSE - PODSUMOWANIE
    // =========================

    [HttpGet("summary")]
    public IActionResult GetSummary()
    {
        var userId = GetUserId();

        var incomes = _db.Incomes
            .Where(x => x.UserId == userId)
            .ToList();

        var expenses = _db.Expenses
            .Where(x => x.UserId == userId)
            .ToList();

        var totalIncome = incomes.Sum(x => x.Amount);
        var totalExpenses = expenses.Sum(x => x.Amount);

        return Ok(new
        {
            balance = totalIncome - totalExpenses,
            totalIncome,
            totalExpenses
        });
    }

    // =========================
    // PRZYCHODY
    // =========================

    [HttpGet("incomes")]
    public IActionResult GetIncomes()
    {
        var userId = GetUserId();

        var incomes = _db.Incomes
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Date)
            .ToList();

        return Ok(incomes);
    }

    [HttpPost("incomes")]
    public IActionResult AddIncome(
        [FromBody] CreateIncomeRequest request)
    {
        var userId = GetUserId();

        var income = new Income
        {
            Amount = request.Amount,
            Type = request.Type ?? "salary",
            Source = request.Source,
            Description = request.Description,
            Date = request.Date.HasValue
    ? DateTime.SpecifyKind(
        request.Date.Value,
        DateTimeKind.Utc
    )
    : DateTime.UtcNow,
            UserId = userId
        };

        _db.Incomes.Add(income);
        _db.SaveChanges();

        return Ok(income);
    }

    [HttpDelete("incomes/{id}")]
    public IActionResult DeleteIncome(int id)
    {
        var userId = GetUserId();

        var income = _db.Incomes
            .FirstOrDefault(x =>
                x.Id == id &&
                x.UserId == userId);

        if (income == null)
            return NotFound();

        _db.Incomes.Remove(income);
        _db.SaveChanges();

        return NoContent();
    }

    // =========================
    // WYDATKI
    // =========================

    [HttpGet("expenses")]
    public IActionResult GetExpenses(
        [FromQuery] string period = "month",
        [FromQuery] string? category = null)
    {
        var userId = GetUserId();

        var query = _db.Expenses
            .Where(x => x.UserId == userId);

        var now = DateTime.UtcNow;

        if (period == "month")
        {
            var startOfMonth = new DateTime(
                now.Year,
                now.Month,
                1,
                0,
                0,
                0,
                DateTimeKind.Utc
            );

            var startOfNextMonth =
                startOfMonth.AddMonths(1);

            query = query.Where(x =>
                x.Date >= startOfMonth &&
                x.Date < startOfNextMonth
            );
        }
        else if (period == "previous")
        {
            var startOfCurrentMonth = new DateTime(
                now.Year,
                now.Month,
                1,
                0,
                0,
                0,
                DateTimeKind.Utc
            );

            var startOfPreviousMonth =
                startOfCurrentMonth.AddMonths(-1);

            query = query.Where(x =>
                x.Date >= startOfPreviousMonth &&
                x.Date < startOfCurrentMonth
            );
        }
        else if (period == "all")
        {
            if (string.IsNullOrWhiteSpace(category))
            {
                return Ok(new List<Expense>());
            }

            query = query.Where(x =>
                x.Category == category
            );
        }

        var expenses = query
            .OrderByDescending(x => x.Date)
            .ToList();

        return Ok(expenses);
    }

    [HttpPost("expenses")]
    public IActionResult AddExpense(
        [FromBody] CreateExpenseRequest request)
    {
        var userId = GetUserId();

        var expense = new Expense
{
    Amount = request.Amount,
    Category = request.Category ?? "other",
    Description = request.Description,
    Date = request.Date.HasValue
        ? DateTime.SpecifyKind(
            request.Date.Value,
            DateTimeKind.Utc
        )
        : DateTime.UtcNow,
    UserId = userId
};

        _db.Expenses.Add(expense);
        _db.SaveChanges();

        return Ok(expense);
    }

    [HttpDelete("expenses/{id}")]
    public IActionResult DeleteExpense(int id)
    {
        var userId = GetUserId();

        var expense = _db.Expenses
            .FirstOrDefault(x =>
                x.Id == id &&
                x.UserId == userId);

        if (expense == null)
            return NotFound();

        _db.Expenses.Remove(expense);
        _db.SaveChanges();

        return NoContent();
    }
}

// =========================
// REQUESTY
// =========================

public class CreateIncomeRequest
{
    public decimal Amount { get; set; }

    public string? Type { get; set; }

    public string? Source { get; set; }

    public string? Description { get; set; }

    public DateTime? Date { get; set; }
}

public class CreateExpenseRequest
{
    public decimal Amount { get; set; }

    public string? Category { get; set; }

    public string? Description { get; set; }

    public DateTime? Date { get; set; }
}