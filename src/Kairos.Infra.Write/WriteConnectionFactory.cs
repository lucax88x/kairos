using System.Net;
using System.Threading.Tasks;
using EventStore.ClientAPI;
using Kairos.Config;

namespace Kairos.Infra.Write
{
    public interface IWriteConnectionFactory
    {
        Task<IEventStoreConnection> Connect();
    }

    public class WriteConnectionFactory : IWriteConnectionFactory
    {
        private readonly WriteRepositoryConfig _writeRepositoryConfig;

        public WriteConnectionFactory(WriteRepositoryConfig writeRepositoryConfig)
        {
            _writeRepositoryConfig = writeRepositoryConfig;
        }

        public async Task<IEventStoreConnection> Connect()
        {
            var connection =
                EventStoreConnection.Create(_writeRepositoryConfig.ConnectionString);

            await connection.ConnectAsync();

            return connection;
        }
    }
}