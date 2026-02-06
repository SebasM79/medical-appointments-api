namespace MedicalAppointments.Api.Models
{
    public class AppointmentTodayDto
    {
        public int AppointmentId { get; set; }
        public string Patient { get; set; }
        public string Doctor { get; set; }
        public DateTime Time { get; set; }
        public string Status { get; set; }

        public bool CanCheckIn { get; set; }
        public bool CanAttend { get; set; }
    }
}