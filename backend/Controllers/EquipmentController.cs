using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechSolutions.API.Data;
using TechSolutions.API.DTOs;
using TechSolutions.API.Models;

namespace TechSolutions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentsController : ControllerBase
    {
        private readonly DataContext _context;

        public EquipmentsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<EquipmentListItemDto>>> GetAll()
        {
            return await _context.Equipments
            .AsNoTracking()
             .Select(e => new EquipmentListItemDto
             {
                 Id = e.Id,
                 Name = e.Name,
                 SerialNumber = e.SerialNumber,
                 Description = e.Description,
                 Status = e.Status,
                 Location = e.Location,
                 CreatedDate = e.CreatedDate,
                 History = e.History
                .OrderByDescending(h => h.ActionDate)
                .Select(h => new ActionHistoryItemDto
                {
                    Id = h.Id,
                    ActionDate = h.ActionDate,
                    PerformedBy = h.PerformedBy,
                    ActionType = h.ActionType,
                    Notes = h.Notes
                })
                .ToList()
             })
            .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Equipment>> GetById([FromRoute] int id)
        {
            var item = await _context.Equipments
            .AsNoTracking()
            .Include(e => e.History)
            .FirstOrDefaultAsync(e => e.Id == id);

            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] EquipmentDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var equipment = new Equipment
            {
                Name = dto.Name,
                SerialNumber = dto.SerialNumber,
                Description = dto.Description,
                Status = dto.Status,
                Location = dto.Location
            };

            _context.Equipments.Add(equipment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = equipment.Id }, equipment);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update([FromRoute] int id, [FromBody] EquipmentDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var equipment = await _context.Equipments.FirstOrDefaultAsync(e => e.Id == id);
            if (equipment == null) return NotFound();

            equipment.Name = dto.Name;
            equipment.SerialNumber = dto.SerialNumber;
            equipment.Description = dto.Description;
            equipment.Status = dto.Status;
            equipment.Location = dto.Location;

            await _context.SaveChangesAsync();
            return Ok("Equipamento alterado com sucesso! :)");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] int id)
        {
            var equipment = await _context.Equipments.FindAsync(id);
            if (equipment == null) return NotFound();

            _context.Equipments.Remove(equipment);
            await _context.SaveChangesAsync();
            return Ok("Equipamento removido com sucesso!");
        }

        [HttpPost("{id:int}/action")]
        public async Task<IActionResult> RegisterAction([FromRoute] int id, [FromBody] ActionRequestDTO request)
        {
            var equipment = await _context.Equipments.FindAsync(id);
            if (equipment == null)
                return NotFound(new { mensagem = "Equipamento não encontrado." });


            var performedBy = (request.PerformedBy ?? "").Trim();
            var actionType = (request.ActionType ?? "").Trim();
            var notes = (request.Notes ?? "").Trim();

            if (string.IsNullOrEmpty(performedBy) && string.IsNullOrEmpty(actionType) && string.IsNullOrEmpty(notes))
                return BadRequest(new { mensagem = "Preencha pelo menos um campo." });

            var action = new ActionHistory
            {
                EquipmentId = id,
                PerformedBy = string.IsNullOrEmpty(performedBy) ? "Admin" : performedBy,
                ActionType = actionType,
                Notes = notes,
                ActionDate = DateTime.UtcNow
            };

            _context.ActionHistories.Add(action);
            await _context.SaveChangesAsync();

            return Ok(action);
        }


        [HttpGet("{id}/history")]
        public async Task<IActionResult> GetHistory([FromRoute] int id)
        {
            var exists = await _context.Equipments.AnyAsync(e => e.Id == id);
            if (!exists) return NotFound();

            var history = await _context.ActionHistories
                .AsNoTracking()
                .Where(h => h.EquipmentId == id)
                .OrderByDescending(h => h.ActionDate)
                .ToListAsync();

            return Ok(history);
        }

        [HttpPatch("{id}/status/{status}")]
        public async Task<IActionResult> ChangeStatus([FromRoute] int id, [FromRoute] int status)
        {
            var equipment = await _context.Equipments.FindAsync(id);
            if (equipment == null) return NotFound();

            if (!Enum.IsDefined(typeof(EquipmentStatus), status))
                return BadRequest("Situação inválida.");

            equipment.Status = (EquipmentStatus)status;
            await _context.SaveChangesAsync();

            return Ok(equipment);
        }
    }
}
