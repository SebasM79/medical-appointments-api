using MedicalAppointments.Api.Data.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<DoctorRepository>();
builder.Services.AddScoped<OfficeRepository>();
builder.Services.AddScoped<MedicalRecordRepository>();
builder.Services.AddScoped<MedicalEpisodeRepository>();
// 🔹 Database connection factory
builder.Services.AddSingleton<MedicalAppointments.Api.Data.DbConnectionFactory>();
builder.Services.AddScoped<AppointmentRepository>();
builder.Services.AddScoped<MedicalRecordRepository>();

var app = builder.Build();

// 🔹 Pipeline
if (app.Environment.IsDevelopment())
{
    // Swagger eliminado temporalmente
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
