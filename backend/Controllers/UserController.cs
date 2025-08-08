using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechSolutions.API.Data;
using TechSolutions.API.DTOs;
using TechSolutions.API.Models;

namespace TechSolutions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { mensagem = "Requisição inválida." });

            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.PasswordHash != request.Password)
                return Unauthorized(new { mensagem = "Credenciais inválidas." });

            return Ok(new
            {
                mensagem = "Login realizado com sucesso",
                id = user.Id,
                nome = user.Name,
                email = user.Email
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { mensagem = "Dados do usuário inválidos." });

            var exists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (exists)
                return Conflict(new { mensagem = "E-mail já cadastrado." });

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = request.Password
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, new
            {
                mensagem = "Usuário criado com sucesso.",
                id = user.Id,
                nome = user.Name,
                email = user.Email
            });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return NotFound(new { mensagem = "Usuário não encontrado." });

            return Ok(new
            {
                id = user.Id,
                nome = user.Name,
                email = user.Email
            });
        }
    }
}
