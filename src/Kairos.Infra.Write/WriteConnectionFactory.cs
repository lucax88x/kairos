using System;
using System.Threading.Tasks;
using EventStore.ClientAPI;
using Kairos.Config;

namespace Kairos.Infra.Write
{
    public interface IWriteConnectionFactory
    {
        Task<IEventStoreConnection> GetConnection();
    }

    public class WriteConnectionFactory : IWriteConnectionFactory, IDisposable
    {
        private readonly WriteRepositoryConfig _writeRepositoryConfig;
        private IEventStoreConnection? _connection;

        public WriteConnectionFactory(WriteRepositoryConfig writeRepositoryConfig)
        {
            _writeRepositoryConfig = writeRepositoryConfig;
        }

        public async Task<IEventStoreConnection> GetConnection()
        {
            if (_connection == null)
            {
                _connection = EventStoreConnection.Create(_writeRepositoryConfig.ConnectionString);
                await _connection.ConnectAsync();
            }

            return _connection;
        }

        public void Dispose()
        {
            _connection?.Dispose();
        }
    }
}