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
        public IActionResult GetSchedule(int id)
        {
            try
            {
                var schedule = _doctorRepository.GetDoctorSchedule(id);
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
        public IActionResult GetAvailability(int id)
        {
            var result = _doctorRepository.GetDoctorAvailability(id);
            return Ok(result);
        }
        [HttpPost("create")] //crear médico
        public IActionResult CreateDoctor([FromBody] CreateDoctorDto doctor)
        {
            if (doctor == null)
                return BadRequest("Doctor data is required.");

        var newDoctorId = _doctorRepository.CreateDoctor(doctor);

        return CreatedAtAction(
            nameof(GetSchedule),
            new { id = newDoctorId },
            new { DoctorId = newDoctorId }
        );
        }
        [HttpGet]
        public IActionResult GetAllDoctors()
        {
        var doctors = _doctorRepository.GetAllDoctors();
        return Ok(doctors);
        }
    }    
}