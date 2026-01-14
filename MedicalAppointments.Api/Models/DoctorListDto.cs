namespace MedicalAppointments.Api.Models
{
    public class DoctorListDto
    {
        public int DoctorId { get; set; }
        public string FullName { get; set; }
        public string LicenseNumber { get; set; }
        public string TreatmentUnit { get; set; }
    }
}
