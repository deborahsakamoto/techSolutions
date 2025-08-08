using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TechSolutions.API.Models
{
    public class ActionHistory
    {
        public int Id { get; set; }

        [Required]
        public DateTime ActionDate { get; set; } = DateTime.UtcNow;

        [Required, MaxLength(120)]
        public string PerformedBy { get; set; } = string.Empty;

        [Required, MaxLength(120)]
        public string ActionType { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;
        
        public int EquipmentId { get; set; }

        [ForeignKey(nameof(EquipmentId))]
        public Equipment Equipment { get; set; } = null!;
    }
}
