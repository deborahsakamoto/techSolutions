using System.ComponentModel.DataAnnotations;

namespace TechSolutions.API.DTOs
{
    public class ActionRequestDTO
    {
        [Required, MaxLength(120)]
        public string PerformedBy { get; set; } = string.Empty;

        [Required, MaxLength(120)]
        public string ActionType { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;
    }
}
