namespace MedicalAppointments.Api.Models
{
    public class CreateOfficeDto
    {
        public string Description { get; set; }
        public string NumberOffice { get; set; }
        public int BranchId { get; set; }
    }
}
