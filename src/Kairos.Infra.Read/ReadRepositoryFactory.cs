using Kairos.Common;

namespace Kairos.Infra.Read
{
    public class ReadRepositoryFactory
    {
        private readonly IReadConnectionFactory _readConnectionFactory;
        private readonly ISerializer _serializer;
        private readonly int _database;

        public ReadRepositoryFactory(IReadConnectionFactory readConnectionFactory, ISerializer serializer,
            int database = 0)
        {
            _readConnectionFactory = readConnectionFactory;
            _serializer = serializer;
            _database = database;
        }

        public IReadRepository Build(string prefix)
        {
            return new ReadRepository(_readConnectionFactory.Connection, _serializer, _database, $"{prefix}_");
        }
    }
}