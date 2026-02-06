using Dapper;
using MedicalAppointments.Api.Models;
using System.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MedicalAppointments.Api.Data.Repositories
{
    public class AppointmentRepository
    {
        private readonly DbConnectionFactory _connectionFactory;

        public AppointmentRepository(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<AppointmentTodayDto>> GetTodayAppointmentsAsync()
        {
            const string sql = @"
                SELECT
                    a.appointment_id AS AppointmentId,
                    p.first_name_patient + ' ' + p.last_name_patient AS Patient,
                    d.first_name_doctor + ' ' + d.last_name_doctor AS Doctor,
                    a.appointment_datetime AS Time,
                    a.status AS Status,
                    CASE WHEN a.status = 'SCHEDULED' THEN 1 ELSE 0 END AS CanCheckIn,
                    CASE WHEN a.status = 'CHECKED_IN' THEN 1 ELSE 0 END AS CanAttend
                FROM Appointment a
                INNER JOIN Patient p ON a.patient_id = p.patient_id
                INNER JOIN MedicalAgenda ma ON a.medical_agenda_id = ma.medical_agenda_id
                INNER JOIN DoctorSpecialty ds ON ma.doctor_specialty_id = ds.doctor_specialty_id
                INNER JOIN Doctor d ON ds.doctor_id = d.doctor_id
                WHERE CAST(a.appointment_datetime AS DATE) = CAST(GETDATE() AS DATE)
                ORDER BY a.appointment_datetime;
            ";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<AppointmentTodayDto>(sql);
        }
    }
}