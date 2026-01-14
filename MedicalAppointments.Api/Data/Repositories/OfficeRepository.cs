using Dapper;
using MedicalAppointments.Api.Models;
using System.Collections.Generic;
using System.Data;

namespace MedicalAppointments.Api.Data.Repositories
{
    public class OfficeRepository
    {
        private readonly DbConnectionFactory _connectionFactory;

        public OfficeRepository(DbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public IEnumerable<OfficeDto> GetAll()
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
            return connection.Query<OfficeDto>(sql);
        }

        public int Create(CreateOfficeDto office)
        {
            const string sql = @"
                INSERT INTO Office (description, number_office, branch_id)
                VALUES (@Description, @NumberOffice, @BranchId);

                SELECT CAST(SCOPE_IDENTITY() AS int);
            ";

            using IDbConnection connection = _connectionFactory.CreateConnection();
            return connection.QuerySingle<int>(sql, office);
        }
    }
}
