using System.ComponentModel.DataAnnotations;

namespace TechSolutions.API.Models
{
    public enum EquipmentStatus
    {
        Available = 0,
        InMaintenance = 1,
        Transferred = 2,
        Discarded = 3
    }

    public class Equipment
    {
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string SerialNumber { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public EquipmentStatus Status { get; set; } = EquipmentStatus.Available;

        [MaxLength(150)]
        public string Location { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public List<ActionHistory> History { get; set; } = new();
    }
}
