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
        private readonly AppointmentRepository _appointmentRepository;

        public AppointmentsController(
            MedicalRecordRepository medicalRecordRepository,
            AppointmentRepository appointmentRepository)
        {
            _medicalRecordRepository = medicalRecordRepository;
            _appointmentRepository = appointmentRepository;
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(int id, [FromBody] AttendAppointmentDto dto)
        {
            try
            {
                var episode = await _medicalRecordRepository.AttendAppointmentAsync(id, dto.DoctorId);
                return Ok(episode);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetToday()
        {
            var result = await _appointmentRepository.GetTodayAppointmentsAsync();
            return Ok(result);
        }
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok("appointments controller alive");
        }
    }
}