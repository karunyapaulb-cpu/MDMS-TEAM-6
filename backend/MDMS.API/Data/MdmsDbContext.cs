using Microsoft.EntityFrameworkCore;
using MDMS.API.Models;

namespace MDMS.API.Data;

public class MdmsDbContext : DbContext
{
    public MdmsDbContext(
        DbContextOptions<MdmsDbContext> options)
        : base(options)
    {
    }

    public DbSet<Zone> Zones => Set<Zone>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Meter> Meters => Set<Meter>();
    public DbSet<Bill> Bills => Set<Bill>();
    public DbSet<BillDay> BillDays => Set<BillDay>();
    public DbSet<Reading> Readings => Set<Reading>();
    public DbSet<Alert> Alerts => Set<Alert>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Setting> Settings => Set<Setting>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.Entity<User>()
            .HasOne<Zone>()
            .WithMany()
            .HasForeignKey(x => x.ZoneId)
            .OnDelete(DeleteBehavior.Restrict);


        model.Entity<Meter>()
            .HasOne<Zone>()
            .WithMany()
            .HasForeignKey(x => x.ZoneId)
            .OnDelete(DeleteBehavior.Restrict);

        model.Entity<Meter>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        model.Entity<Bill>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.UserId);

        model.Entity<BillDay>()
            .HasOne<Bill>()
            .WithMany()
            .HasForeignKey(x => x.BillId);

        model.Entity<Reading>()
            .HasOne<Meter>()
            .WithMany()
            .HasForeignKey(x => x.MeterId);

        model.Entity<Meter>()
            .HasIndex(x => x.MeterNumber)
            .IsUnique();

        model.Entity<Bill>()
            .Property(x => x.Amount)
            .HasPrecision(18, 2);

        model.Entity<BillDay>()
            .Property(x => x.Cost)
            .HasPrecision(18, 2);
    }
}