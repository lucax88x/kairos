using System.Net;
using System.Threading.Tasks;
using EventStore.ClientAPI;

namespace Kairos.Infra.Write
{
    public interface IWriteConnectionFactory
    {
        Task<IEventStoreConnection> Connect();
    }

    public class WriteConnectionFactory : IWriteConnectionFactory
    {
        public async Task<IEventStoreConnection> Connect()
        {
            var connection =
                EventStoreConnection.Create(new IPEndPoint(IPAddress.Loopback, 1113));

            await connection.ConnectAsync();

            return connection;
        }
    }
}