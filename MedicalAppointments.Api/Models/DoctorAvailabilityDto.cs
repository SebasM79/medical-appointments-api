namespace MedicalAppointments.Api.Models
{
    public class DoctorAvailabilityDto
    {
        public string Doctor { get; set; }
        public string Specialty { get; set; }
        public string Branch { get; set; }
        public string Office { get; set; }
        public int DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
