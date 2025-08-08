using System.ComponentModel.DataAnnotations;

namespace TechSolutions.API.DTOs
{
    public class RegisterUserRequest
    {
        [Required, MaxLength(120)]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(200)]
        public string Password { get; set; } = string.Empty;
    }
}
