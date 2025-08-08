using TechSolutions.API.Models;
using System.ComponentModel.DataAnnotations;

namespace TechSolutions.API.DTOs
{
    public class EquipmentDTO
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string SerialNumber { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
        
        public EquipmentStatus Status { get; set; }

        [MaxLength(150)]
        public string Location { get; set; } = string.Empty;
    }
}
