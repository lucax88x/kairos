using Kairos.Common;

namespace Kairos.Infra.Read
{
    public class ReadRepositoryFactory
    {
        private readonly IReadConnectionFactory _readConnectionFactory;
        private readonly ISerializer _serializer;

        public ReadRepositoryFactory(IReadConnectionFactory readConnectionFactory, ISerializer serializer)
        {
            _readConnectionFactory = readConnectionFactory;
            _serializer = serializer;
        }

        public IReadRepository Build(string prefix)
        {
            return new ReadRepository(_readConnectionFactory.Connection, _serializer, _readConnectionFactory.Database, $"{prefix}_");
        }
    }
}