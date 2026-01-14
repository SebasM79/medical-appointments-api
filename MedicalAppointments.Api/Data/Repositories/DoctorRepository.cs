using Dapper;
using MedicalAppointments.Api.Models;
using System.Collections.Generic;
using System.Data;

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
        // AGENDA DEL MÉDICO
        // =========================
        public IEnumerable<DoctorScheduleDto> GetDoctorSchedule(int doctorId)
        {
            const string sql = @"
                SELECT 
                    d.first_name_doctor + ' ' + d.last_name_doctor AS Doctor,
                    s.name_specialty AS Specialty,
                    b.name_branch AS Branch,
                    o.number_office AS Office,
                    ma.day_of_week AS DayOfWeek,
                    ma.start_time AS StartTime,
                    ma.end_time AS EndTime
                FROM MedicalAgenda ma
                INNER JOIN DoctorSpecialty ds ON ma.doctor_specialty_id = ds.doctor_specialty_id
                INNER JOIN Doctor d ON ds.doctor_id = d.doctor_id
                INNER JOIN Specialty s ON ds.specialty_id = s.specialty_id
                INNER JOIN Office o ON ma.office_id = o.office_id
                INNER JOIN Branch b ON o.branch_id = b.branch_id
                WHERE d.doctor_id = @DoctorId
                ORDER BY b.name_branch, ma.day_of_week, ma.start_time;
            ";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            return connection.Query<DoctorScheduleDto>(sql, new { DoctorId = doctorId });
        }

        // =========================
        // DISPONIBILIDAD DEL MÉDICO
        // =========================
        public IEnumerable<DoctorAvailabilityDto> GetDoctorAvailability(int doctorId)
        {
            const string sql = @"
                SELECT 
                    d.first_name_doctor + ' ' + d.last_name_doctor AS Doctor,
                    s.name_specialty AS Specialty,
                    b.name_branch AS Branch,
                    o.number_office AS Office,
                    ma.day_of_week AS DayOfWeek,
                    ma.start_time AS StartTime,
                    ma.end_time AS EndTime
                FROM MedicalAgenda ma
                INNER JOIN DoctorSpecialty ds ON ma.doctor_specialty_id = ds.doctor_specialty_id
                INNER JOIN Doctor d ON ds.doctor_id = d.doctor_id
                INNER JOIN Specialty s ON ds.specialty_id = s.specialty_id
                INNER JOIN Office o ON ma.office_id = o.office_id
                INNER JOIN Branch b ON o.branch_id = b.branch_id
                WHERE ds.doctor_id = @DoctorId
                AND NOT EXISTS (
                    SELECT 1
                    FROM Appointment a
                    WHERE a.medical_agenda_id = ma.medical_agenda_id
                      AND CAST(a.appointment_datetime AS DATE) = CAST(GETDATE() AS DATE)
                )
                ORDER BY ma.day_of_week, ma.start_time;
            ";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            return connection.Query<DoctorAvailabilityDto>(sql, new { DoctorId = doctorId });
        }
        // =========================
        // CREAR MÉDICO
        // =========================
        public int CreateDoctor(CreateDoctorDto doctor)
        {
            const string sql = @"
            INSERT INTO Doctor (
            first_name_doctor,
            last_name_doctor,
            license_number,
            address,
            phone,
            email,
            treatment_units_id
        )
        VALUES (
            @FirstName,
            @LastName,
            @LicenseNumber,
            @Address,
            @Phone,
            @Email,
            @TreatmentUnitId
        );

        SELECT CAST(SCOPE_IDENTITY() AS int);
         ";

        using IDbConnection connection = _connectionFactory.CreateConnection();
        return connection.QuerySingle<int>(sql, doctor);
    }
    // =========================
    // TRAER TODOS LOS MÉDICO
    // =========================
    public IEnumerable<DoctorListDto> GetAllDoctors()
    {
    const string sql = @"
        SELECT 
            d.doctor_id AS DoctorId,
            d.first_name_doctor + ' ' + d.last_name_doctor AS FullName,
            d.license_number AS LicenseNumber,
            tu.name_Ut AS TreatmentUnit
        FROM Doctor d
        INNER JOIN TreatmentUnit tu 
            ON d.treatment_units_id = tu.treatment_units_id
        ORDER BY d.last_name_doctor;
    ";

    using IDbConnection connection = _connectionFactory.CreateConnection();
    return connection.Query<DoctorListDto>(sql);
    }

}   
}