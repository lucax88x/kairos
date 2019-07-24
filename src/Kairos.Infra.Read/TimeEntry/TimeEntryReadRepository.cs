using System;
using System.Collections.Immutable;
using System.Threading.Tasks;

namespace Kairos.Infra.Read.TimeEntry
{
    public interface ITimeEntryReadRepository
    {
        Task Add(Guid id, string user, DateTimeOffset when, int type);
        Task Delete(Guid id, string user);
        Task<ImmutableArray<TimeEntryReadDto>> Get(string user);
        Task<TimeEntryReadDto> GetById(Guid id);
    }

    public class TimeEntryReadRepository : ITimeEntryReadRepository
    {
        private readonly IReadRepository _repository;

        public TimeEntryReadRepository(ReadRepositoryFactory readRepositoryFactory)
        {
            _repository = readRepositoryFactory.Build("time-entry");
        }

        public async Task Add(Guid id, string user, DateTimeOffset when, int type)
        {
            var dto = new TimeEntryReadDto(id, when, type);

            await _repository.Set(id, dto);
            await _repository.SortedSetAdd($"by-when|by-user|{user}", dto.When.UtcTicks, id);
        }

        public async Task Delete(Guid id, string user)
        {
            await _repository.SetRemove(id);
            await _repository.SortedSetRemove($"by-when|by-user|{user}", id);
        }

        public async Task<ImmutableArray<TimeEntryReadDto>> Get(string user)
        {
            var ids = await _repository.SortedSetRangeByScore($"by-when|by-user|{user}");

            return await _repository.GetMultiple<TimeEntryReadDto>(ids);
        }

        public async Task<TimeEntryReadDto> GetById(Guid id)
        {
            return await _repository.Get<TimeEntryReadDto>(id);
        }
    }
}