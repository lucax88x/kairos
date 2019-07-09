using System;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using Kairos.Config;
using StackExchange.Redis;

namespace Kairos.Infra.Read
{
    public interface IReadConnectionFactory: IDisposable
    {
        IConnectionMultiplexer Connection { get; }
        void FlushDatabase(int database);
    }

    public class ReadConnectionFactory : IReadConnectionFactory
    {
        private IConnectionMultiplexer _connection;
        private readonly ReadRepositoryConfig _readRepositoryConfig;

        public IConnectionMultiplexer Connection
        {
            get
            {
                if (_connection != null) return _connection;
                
                var redisConfigurationOptions = new ConfigurationOptions();
                _readRepositoryConfig.Endpoints.ForEach(endpoint =>
                { 
                    var isIp = IsIpAddress(endpoint);
                    if (!isIp)
                    {
                        var ip = Dns.GetHostEntry(endpoint);
                        redisConfigurationOptions.EndPoints.Add(ip.AddressList.First(), 6379);
                    }
                    else
                    {
                        redisConfigurationOptions.EndPoints.Add(endpoint, 6379);
                    }
                });
                redisConfigurationOptions.AllowAdmin = true;

                _connection = ConnectionMultiplexer.Connect(redisConfigurationOptions);

                return _connection;
            }
        }

        public void FlushDatabase(int database)
        {
            foreach (var endPoint in Connection.GetEndPoints())
            {
                Connection.GetServer(endPoint).FlushDatabase(database);
            }
        }

        public ReadConnectionFactory(ReadRepositoryConfig readRepositoryConfig)
        {
            _readRepositoryConfig = readRepositoryConfig;
        }

        public void Dispose()
        {
            if (_connection == null) return;
            
            _connection.Close();
            _connection.Dispose();
        }
        
        private bool IsIpAddress(string host)
        {
            return Regex.IsMatch(host, @"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b");
        }
    }
}