using Dapper;
using MedicalAppointments.Api.Models;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace MedicalAppointments.Api.Data.Repositories
{
    public class OfficeRepository
    {
        private readonly DbConnectionFactory _connectionFactory;

        public OfficeRepository(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<IEnumerable<OfficeDto>> GetAllAsync()
        {
            const string sql = @"
                SELECT
                    o.office_id AS OfficeId,
                    o.description AS Description,
                    o.number_office AS NumberOffice,
                    b.name_branch AS Branch
                FROM Office o
                INNER JOIN Branch b ON o.branch_id = b.branch_id
                ORDER BY b.name_branch, o.number_office;
            ";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            return await connection.QueryAsync<OfficeDto>(sql);
        }

        public async Task<int> CreateAsync(CreateOfficeDto office)
        {
            const string sql = @"
                INSERT INTO Office (description, number_office, branch_id)
                VALUES (@Description, @NumberOffice, @BranchId);

                SELECT CAST(SCOPE_IDENTITY() AS int);
            ";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            return await connection.QuerySingleAsync<int>(sql, office);
        }
    }
}
