using Microsoft.AspNetCore.Mvc;
using MedicalAppointments.Api.Data.Repositories;
using MedicalAppointments.Api.Models;
namespace MedicalAppointments.Api.Controllers
{
    [ApiController]
    [Route("api/doctors")]
    public class DoctorsController : ControllerBase
    {
        private readonly DoctorRepository _doctorRepository;

        public DoctorsController(DoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }

        [HttpGet("{id}/schedule")] //agenda del médico
        public async Task<IActionResult> GetSchedule(int id)
        {
            try
            {
                var schedule = await _doctorRepository.GetDoctorScheduleAsync(id);
                return Ok(schedule);
            }
            catch (InvalidOperationException ex)
            {
                // Error al ejecutar la consulta en la base de datos (mensajes claros)
                return StatusCode(500, new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Unexpected error occurred" });
            }
        }
        [HttpGet("{id}/availability")] //disponibilidad de médico
        public async Task<IActionResult> GetAvailability(int id)
        {
            var result = await _doctorRepository.GetDoctorAvailabilityAsync(id);
            return Ok(result);
        }
        [HttpPost("create")] //crear médico
        public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorDto doctor)
        {
            if (doctor == null)
                return BadRequest("Doctor data is required.");

            var newDoctorId = await _doctorRepository.CreateDoctorAsync(doctor);

            return CreatedAtAction(
                nameof(GetSchedule),
                new { id = newDoctorId },
                new { DoctorId = newDoctorId }
            );
        }
        [HttpGet]
        public async Task<IActionResult> GetAllDoctors()
        {
            var doctors = await _doctorRepository.GetAllDoctorsAsync();
            return Ok(doctors);
        }
    }    
}