namespace ADHDashboard.Api.Data;

public class User
{
    public int Id { get; set; }

    public string GoogleId { get; set; } = "";

    public string Email { get; set; } = "";

    public string Name { get; set; } = "";

    public string? PictureUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}