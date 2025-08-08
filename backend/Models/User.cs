using System.ComponentModel.DataAnnotations;

namespace TechSolutions.API.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(120)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(120)]
        public string Email { get; set; } = string.Empty;

        //Somente para o teste utilizarei texto simples, em produção deve-se utilizar algum tipo de criptografia.
        [Required, MaxLength(120)]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
