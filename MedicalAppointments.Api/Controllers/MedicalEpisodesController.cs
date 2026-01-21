using Microsoft.AspNetCore.Mvc;
using MedicalAppointments.Api.Data.Repositories;
using MedicalAppointments.Api.Models;
using Microsoft.Data.SqlClient;

namespace MedicalAppointments.Api.Controllers
{
    [ApiController]
    [Route("api/medical-episodes")]
    public class MedicalEpisodesController : ControllerBase
    {
        private readonly MedicalEpisodeRepository _repository;

        public MedicalEpisodesController(MedicalEpisodeRepository repository)
        {
            _repository = repository;
        }

        [HttpPut("{id}/notes")]
        public IActionResult AddNotes(int id, [FromBody] UpdateMedicalEpisodeNotesDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Notes))
                return BadRequest("Notes are required.");

            try
            {
                _repository.AddNotes(id, dto.Notes);
                return NoContent();
            }
            catch (SqlException ex) when (ex.Number == 40401)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (SqlException ex) when (ex.Number == 40901)
            {
                return Conflict(new { error = ex.Message });
            }
        }
    }
}