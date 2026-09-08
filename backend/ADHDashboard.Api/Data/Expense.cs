namespace ADHDashboard.Api.Data;

public class Expense
{
    public int Id { get; set; }

    public decimal Amount { get; set; }

    public string Category { get; set; } = "other";

    public string? Description { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }

    public User User { get; set; } = null!;
}