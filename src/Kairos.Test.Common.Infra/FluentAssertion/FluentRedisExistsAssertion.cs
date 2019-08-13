using System;
using System.Threading.Tasks;
using FluentAssertions;
using Kairos.Infra.Read;

namespace Kairos.Test.Common.Infra.FluentAssertion
{
    public class FluentRedisExistsAssertion
    {
        private readonly ReadRepositoryFactory _readRepositoryFactory;

        public FluentRedisExistsAssertion(ReadRepositoryFactory readRepositoryFactory)
        {
            _readRepositoryFactory = readRepositoryFactory;
        }

        public async Task Set(string prefix, Guid id)
        {
            await Set(prefix, id.ToString());
        }

        public async Task Set(string prefix, string id)
        {
            var readRepository = _readRepositoryFactory.Build(prefix);

            var result = await readRepository.Exists(id);

            if (!result) true.Should().BeFalse($"does not exist with {id}!");

            true.Should().BeTrue();
        }

        public async Task SortedSet(string prefix, string key, int count)
        {
            var readRepository = _readRepositoryFactory.Build(prefix);

            var ids = await readRepository.SortedSetRangeByScore(key);

            ids.Should().HaveCount(count);
        }
    }
}