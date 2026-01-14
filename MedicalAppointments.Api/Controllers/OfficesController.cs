using Microsoft.AspNetCore.Mvc;
using MedicalAppointments.Api.Data.Repositories;
using MedicalAppointments.Api.Models;

[ApiController]
[Route("api/offices")]
public class OfficesController : ControllerBase
{
    private readonly OfficeRepository _officeRepository;

    public OfficesController(OfficeRepository officeRepository)
    {
        _officeRepository = officeRepository;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_officeRepository.GetAll());
    }

    [HttpPost]
    public IActionResult Create(CreateOfficeDto office)
    {
        var id = _officeRepository.Create(office);
        return CreatedAtAction(nameof(GetAll), new { id }, new { OfficeId = id });
    }
}
