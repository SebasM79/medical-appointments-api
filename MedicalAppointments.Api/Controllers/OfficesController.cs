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
    public async Task<IActionResult> GetAll()
    {
        var offices = await _officeRepository.GetAllAsync();
        return Ok(offices);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateOfficeDto office)
    {
        var id = await _officeRepository.CreateAsync(office);
        return CreatedAtAction(nameof(GetAll), new { id }, new { OfficeId = id });
    }
}
