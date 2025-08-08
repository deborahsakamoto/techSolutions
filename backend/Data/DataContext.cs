using Microsoft.EntityFrameworkCore;
using TechSolutions.API.Models;

namespace TechSolutions.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Equipment> Equipments => Set<Equipment>();
        public DbSet<ActionHistory> ActionHistories => Set<ActionHistory>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Equipment>()
                .HasMany(e => e.History)
                .WithOne(h => h.Equipment)
                .HasForeignKey(h => h.EquipmentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Equipment>()
                .HasIndex(e => e.SerialNumber)
                .IsUnique(false);

            modelBuilder.Entity<Equipment>()
                .HasIndex(e => e.Status);
        }
    }
}
