using Microsoft.AspNetCore.Mvc;
using MedicalAppointments.Api.Data.Repositories;
using MedicalAppointments.Api.Models;

namespace MedicalAppointments.Api.Controllers
{
    [ApiController]
    [Route("api/appointments")]
    public class AppointmentsController : ControllerBase
    {
        private readonly MedicalRecordRepository _medicalRecordRepository;

        public AppointmentsController(MedicalRecordRepository medicalRecordRepository)
        {
            _medicalRecordRepository = medicalRecordRepository;
        }

        [HttpPost("{id}/attend")]
        public IActionResult Attend(int id, [FromBody] AttendAppointmentDto dto)
        {
            try
            {
                var episode = _medicalRecordRepository.AttendAppointment(id, dto.DoctorId);
                return Ok(episode);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
 