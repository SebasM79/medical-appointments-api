using MedicalAppointments.Api.Data.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<DoctorRepository>();
builder.Services.AddScoped<OfficeRepository>();
builder.Services.AddScoped<MedicalRecordRepository>();
// 🔹 Database connection factory
builder.Services.AddSingleton<MedicalAppointments.Api.Data.DbConnectionFactory>();

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
