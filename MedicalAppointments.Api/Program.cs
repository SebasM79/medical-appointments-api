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

// 🔹 CORS para permitir el frontend de Vite
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 🔹 Pipeline
if (app.Environment.IsDevelopment())
{
    // Swagger eliminado temporalmente
}

app.UseHttpsRedirection();

// CORS debe ir antes de Authorization y de MapControllers
app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
