using Dapper;
using MedicalAppointments.Api.Models;
using System.Data;
using System.Threading.Tasks;

// de esta forma El backend controla el flujo clínico

namespace MedicalAppointments.Api.Data.Repositories
{
    public class MedicalRecordRepository
    {
        private readonly DbConnectionFactory _connectionFactory;

        public MedicalRecordRepository(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<MedicalEpisodeDto> AttendAppointmentAsync(
            int appointmentId,
            int doctorId)
        {
            using IDbConnection connection = _connectionFactory.CreateConnection();
            connection.Open();

            using var transaction = connection.BeginTransaction();

            try
            {
                // 1. Obtener paciente y validar estado del turno
                const string getPatientSql = @"
                    SELECT a.patient_id
                    FROM Appointment a
                    WHERE a.appointment_id = @AppointmentId
                      AND a.status IN ('CHECKED_IN', 'SCHEDULED');";

                var patientId = await connection.QuerySingleOrDefaultAsync<int?>(
                    getPatientSql,
                    new { AppointmentId = appointmentId },
                    transaction);

                if (patientId is null)
                {
                    throw new InvalidOperationException("Appointment not valid for ATTEND operation.");
                }

                // 2. Marcar turno como ATTENDED
                const string updateAppointmentSql = @"
                    UPDATE Appointment
                    SET status = 'ATTENDED'
                    WHERE appointment_id = @AppointmentId;";

                await connection.ExecuteAsync(
                    updateAppointmentSql,
                    new { AppointmentId = appointmentId },
                    transaction);

                // 3. Obtener o crear historia clínica
                const string getMedicalRecordSql = @"
                    SELECT medical_record_id
                    FROM MedicalRecord
                    WHERE patient_id = @PatientId;";

                var medicalRecordId = await connection.QuerySingleOrDefaultAsync<int?>(
                    getMedicalRecordSql,
                    new { PatientId = patientId.Value },
                    transaction);

                if (medicalRecordId is null)
                {
                    const string insertMedicalRecordSql = @"
                        INSERT INTO MedicalRecord (patient_id)
                        VALUES (@PatientId);

                        SELECT CAST(SCOPE_IDENTITY() AS int);";

                    medicalRecordId = await connection.QuerySingleAsync<int>(
                        insertMedicalRecordSql,
                        new { PatientId = patientId.Value },
                        transaction);
                }

                // 4. Crear episodio clínico
                const string insertEpisodeSql = @"
                    INSERT INTO MedicalEpisode (
                        medical_record_id,
                        appointment_id,
                        doctor_id
                    )
                    VALUES (
                        @MedicalRecordId,
                        @AppointmentId,
                        @DoctorId
                    );

                    SELECT CAST(SCOPE_IDENTITY() AS int);";

                var episodeId = await connection.QuerySingleAsync<int>(
                    insertEpisodeSql,
                    new
                    {
                        MedicalRecordId = medicalRecordId.Value,
                        AppointmentId = appointmentId,
                        DoctorId = doctorId
                    },
                    transaction);

                // 5. Confirmar transacción y devolver DTO construido en C#
                transaction.Commit();

                return new MedicalEpisodeDto
                {
                    MedicalEpisodeId = episodeId,
                    MedicalRecordId = medicalRecordId.Value,
                    AppointmentId = appointmentId,
                    DoctorId = doctorId,
                    CreatedAt = DateTime.UtcNow
                };
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
    }
}