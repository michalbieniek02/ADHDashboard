namespace ADHDashboard.Api.Data;

public class Income
{
    public int Id { get; set; }

    public decimal Amount { get; set; }

    public string Type { get; set; } = "salary";

    public string? Source { get; set; }

    public string? Description { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }

    public User User { get; set; } = null!;
}