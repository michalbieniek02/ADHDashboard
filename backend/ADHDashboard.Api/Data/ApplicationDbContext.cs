using Microsoft.EntityFrameworkCore;

namespace ADHDashboard.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Task> Tasks => Set<Task>();

    public DbSet<Income> Incomes => Set<Income>();

    public DbSet<Expense> Expenses => Set<Expense>();
}