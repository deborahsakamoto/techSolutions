namespace TechSolutions.API.DTOs
{
    public class ActionHistoryItemDto
    {
        public int Id { get; set; }
        public DateTime ActionDate { get; set; }
        public string PerformedBy { get; set; } = string.Empty;
        public string ActionType { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}
