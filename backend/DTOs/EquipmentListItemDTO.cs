using TechSolutions.API.Models;

namespace TechSolutions.API.DTOs
{
    public class EquipmentListItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public EquipmentStatus Status { get; set; }
        public string Location { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public List<ActionHistoryItemDto> History { get; set; } = new();
    }
}
