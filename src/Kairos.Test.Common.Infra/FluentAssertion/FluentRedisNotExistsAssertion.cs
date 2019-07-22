using System;
using System.Threading.Tasks;
using FluentAssertions;
using Kairos.Infra.Read;

namespace Kairos.Test.Common.Infra.FluentAssertion
{
    public class FluentRedisNotExistsAssertion
    {
        private readonly ReadRepositoryFactory _readRepositoryFactory;

        public FluentRedisNotExistsAssertion(ReadRepositoryFactory readRepositoryFactory)
        {
            _readRepositoryFactory = readRepositoryFactory;
        }

        public async Task Set(string prefix, Guid id)
        {
            var readRepository = _readRepositoryFactory.Build(prefix);

            var result = await readRepository.Exists(id);

            if (result) true.Should().BeFalse($"does exists with {id}!");

            true.Should().BeTrue();
        }
        
        public async Task SortedSet(string prefix, string key)
        {
            var readRepository = _readRepositoryFactory.Build(prefix);

            var ids = await readRepository.SortedSetRangeByScore(key);

            ids.Should().HaveCount(0);
        }
    }
}