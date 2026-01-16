using Dapper;
using MedicalAppointments.Api.Models;
using System.Data;
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

        public MedicalEpisodeDto AttendAppointment(
            int appointmentId,
            int doctorId)
        {
            const string sql = @"
                DECLARE @PatientId INT;
                DECLARE @MedicalRecordId INT;
                DECLARE @EpisodeId INT;

                -- 1. Obtener paciente y estado del turno
                SELECT 
                    @PatientId = a.patient_id
                FROM Appointment a
                WHERE a.appointment_id = @AppointmentId
                  AND a.status IN ('CHECKED_IN', 'SCHEDULED');

                IF @PatientId IS NULL
                    THROW 50001, 'Appointment not valid for ATTEND operation.', 1;

                -- 2. Marcar turno como ATTENDED
                UPDATE Appointment
                SET status = 'ATTENDED'
                WHERE appointment_id = @AppointmentId;

                -- 3. Obtener o crear historia clínica
                SELECT @MedicalRecordId = medical_record_id
                FROM MedicalRecord
                WHERE patient_id = @PatientId;

                IF @MedicalRecordId IS NULL
                BEGIN
                    INSERT INTO MedicalRecord (patient_id)
                    VALUES (@PatientId);

                    SET @MedicalRecordId = SCOPE_IDENTITY();
                END

                -- 4. Crear episodio clínico
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

                SET @EpisodeId = SCOPE_IDENTITY();

                -- 5. Devolver episodio creado
                SELECT
                    @EpisodeId AS MedicalEpisodeId,
                    @MedicalRecordId AS MedicalRecordId,
                    @AppointmentId AS AppointmentId,
                    @DoctorId AS DoctorId,
                    GETDATE() AS CreatedAt;
            ";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            return connection.QuerySingle<MedicalEpisodeDto>(sql, new
            {
                AppointmentId = appointmentId,
                DoctorId = doctorId
            });
        }
    }
}