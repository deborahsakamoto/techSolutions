using Microsoft.EntityFrameworkCore;
using TechSolutions.API.Models;

namespace TechSolutions.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(DataContext context)
        {
            context.Database.Migrate();

            if (!context.Users.Any())
            {
                context.Users.Add(new User
                {
                    Name = "Admin",
                    Email = "admin@teste.com",
                    PasswordHash = "123"
                });
                context.SaveChanges();
            }

            if (!context.Equipments.Any())
            {
                var eq1 = new Equipment
                {
                    Name = "Dell Latitude 7320",
                    SerialNumber = "LAT-7320-001",
                    Description = "Ultrabook",
                    Status = EquipmentStatus.Available,
                    Location = "Sede 01 - Sala de desenvolvimento"
                };

                var eq2 = new Equipment
                {
                    Name = "HP LaserJet Pro",
                    SerialNumber = "HP-LJP-201",
                    Description = "Impressora",
                    Status = EquipmentStatus.InMaintenance,
                    Location = "Sede 02 - Sala do gerente"
                };

                context.Equipments.AddRange(eq1, eq2);
                context.SaveChanges();

                context.ActionHistories.Add(new ActionHistory
                {
                    EquipmentId = eq2.Id,
                    PerformedBy = "Admin",
                    ActionType = "Enviado para manutenção",
                    Notes = "Não está imprimindo",
                    ActionDate = DateTime.UtcNow
                });

                context.SaveChanges();
            }
        }
    }
}
