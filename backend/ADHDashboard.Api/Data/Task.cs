namespace ADHDashboard.Api.Data;

public class Task
{
    public int Id { get; set; }

    public string Title { get; set; } = "";

    public bool Done { get; set; }

    public string Type { get; set; } = "general";

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}