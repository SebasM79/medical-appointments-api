using Dapper;
using MedicalAppointments.Api.Models;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace MedicalAppointments.Api.Data.Repositories
{
    public class DoctorRepository
    {
        private readonly DbConnectionFactory _connectionFactory;

        public DoctorRepository(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        // =========================
        // AGENDA DEL MÉDICO (Usa la Vista)
        // =========================
        public async Task<IEnumerable<DoctorScheduleDto>> GetDoctorScheduleAsync(int doctorId)
        {
            // Nota: Seleccionamos solo las columnas del DTO, filtrando por el ID que está en la vista
            const string sql = @"
                SELECT Doctor, Specialty, Branch, Office, DayOfWeek, StartTime, EndTime
                FROM View_DoctorSchedules
                WHERE doctor_id = @DoctorId
                ORDER BY Branch, DayOfWeek, StartTime;";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<DoctorScheduleDto>(sql, new { DoctorId = doctorId });
        }

        // =========================
        // DISPONIBILIDAD DEL MÉDICO (Usa la Vista)
        // =========================
        public async Task<IEnumerable<DoctorAvailabilityDto>> GetDoctorAvailabilityAsync(int doctorId)
        {
            const string sql = @"
                SELECT Doctor, Specialty, Branch, Office, DayOfWeek, StartTime, EndTime
                FROM View_DoctorSchedules v
                WHERE v.doctor_id = @DoctorId
                AND NOT EXISTS (
                    SELECT 1
                    FROM Appointment a
                    WHERE a.medical_agenda_id = v.medical_agenda_id
                      AND CAST(a.appointment_datetime AS DATE) = CAST(GETDATE() AS DATE)
                )
                ORDER BY DayOfWeek, StartTime;";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<DoctorAvailabilityDto>(sql, new { DoctorId = doctorId });
        }

        // =========================
        // CREAR MÉDICO (Sigue igual, apunta a la tabla)
        // =========================
        public async Task<int> CreateDoctorAsync(CreateDoctorDto doctor)
        {
            const string sql = @"
                INSERT INTO Doctor (first_name_doctor, last_name_doctor, license_number, address, phone, email, treatment_units_id)
                VALUES (@FirstName, @LastName, @LicenseNumber, @Address, @Phone, @Email, @TreatmentUnitId);
                SELECT CAST(SCOPE_IDENTITY() AS int);";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleAsync<int>(sql, doctor);
        }

        // =========================
        // TRAER TODOS LOS MÉDICOS (Podrías hacer otra vista si quisieras)
        // =========================
        public async Task<IEnumerable<DoctorListDto>> GetAllDoctorsAsync()
        {
            const string sql = @"
                SELECT 
                    d.doctor_id AS DoctorId,
                    d.first_name_doctor + ' ' + d.last_name_doctor AS FullName,
                    d.license_number AS LicenseNumber,
                    tu.name_Ut AS TreatmentUnit
                FROM Doctor d
                INNER JOIN TreatmentUnit tu ON d.treatment_units_id = tu.treatment_units_id
                ORDER BY d.last_name_doctor;";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<DoctorListDto>(sql);
        }
    }
}