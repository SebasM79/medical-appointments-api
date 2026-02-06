using Dapper;
using System.Data;
using System.Threading.Tasks;

namespace MedicalAppointments.Api.Data.Repositories
{
    public class MedicalEpisodeRepository
    {
        private readonly DbConnectionFactory _connectionFactory;

        public MedicalEpisodeRepository(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task AddNotesAsync(int medicalEpisodeId, string notes)
        {
            const string sql = @"
                -- Verificar que exista y que esté pendiente
                IF NOT EXISTS (
                    SELECT 1
                    FROM MedicalEpisode
                    WHERE medical_episode_id = @MedicalEpisodeId
                )
                THROW 40401, 'Medical episode not found.', 1;

                IF EXISTS (
                    SELECT 1
                    FROM MedicalEpisode
                    WHERE medical_episode_id = @MedicalEpisodeId
                      AND notes IS NOT NULL
                )
                THROW 40901, 'Medical episode already completed.', 1;

                -- Guardar notas (una sola vez)
                UPDATE MedicalEpisode
                SET notes = @Notes
                WHERE medical_episode_id = @MedicalEpisodeId;
            ";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            await connection.ExecuteAsync(sql, new
            {
                MedicalEpisodeId = medicalEpisodeId,
                Notes = notes
            });
        }
    }
}