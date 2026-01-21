
// En este DTO el id viene por URL solo se envía la nota para actualizar po Dr.
namespace MedicalAppointments.Api.Models
{
    public class UpdateMedicalEpisodeNotesDto
    {
        public string? Notes { get; set; }
    }
}