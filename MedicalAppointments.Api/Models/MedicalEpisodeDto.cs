using System;

namespace MedicalAppointments.Api.Models
{
    public class MedicalEpisodeDto
    {
        public int MedicalEpisodeId { get; set; }
        public int MedicalRecordId { get; set; }
        public int AppointmentId { get; set; }
        public int DoctorId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}